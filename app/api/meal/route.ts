import { handleDemoMealRequest, isDemoModeEnabled } from "@/lib/demo-meals";
import { MEAL_SYSTEM_PROMPT } from "@/lib/meal-system-prompt";
import { parseMealResponse } from "@/lib/parse-meal-json";
import type { MealApiResponse, MealRequestBody } from "@/lib/meal-types";
import { NextResponse } from "next/server";

function buildUserPayload(body: MealRequestBody): string {
  return JSON.stringify(
    {
      action: body.action ?? "generate",
      meal_type: body.meal_type,
      dining_mode: body.dining_mode,
      current_meal: body.current_meal ?? null,
      replace_id: body.replace_id ?? null,
      restrictions: body.restrictions?.trim() || "",
    },
    null,
    0
  );
}

async function demoDelay() {
  await new Promise((r) => setTimeout(r, 400));
}

export async function GET() {
  return NextResponse.json({ demo: isDemoModeEnabled() });
}

export async function POST(request: Request) {
  let body: MealRequestBody;
  try {
    body = (await request.json()) as MealRequestBody;
  } catch {
    return NextResponse.json(
      {
        status: "invalid_input",
        meal: null,
        questions: [],
        message: "请求体不是有效的 JSON",
      } satisfies MealApiResponse,
      { status: 400 }
    );
  }

  if (isDemoModeEnabled()) {
    await demoDelay();
    return NextResponse.json(handleDemoMealRequest(body));
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        status: "invalid_input",
        meal: null,
        questions: [],
        message: "未配置 OPENAI_API_KEY，请启用演示模式或配置密钥",
      } satisfies MealApiResponse,
      { status: 503 }
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const userContent = buildUserPayload(body);

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: MEAL_SYSTEM_PROMPT },
          {
            role: "user",
            content: `请根据以下 JSON 输入执行任务，并严格按输出协议返回 JSON：\n${userContent}`,
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, errText);
      return NextResponse.json(
        {
          status: "invalid_input",
          meal: null,
          questions: [],
          message: "搭配服务暂时不可用，请稍后重试",
        } satisfies MealApiResponse,
        { status: 502 }
      );
    }

    const completion = (await openaiRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        {
          status: "invalid_input",
          meal: null,
          questions: [],
          message: "未收到有效搭配结果",
        } satisfies MealApiResponse,
        { status: 502 }
      );
    }

    const parsed = parseMealResponse(content);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        status: "invalid_input",
        meal: null,
        questions: [],
        message: "处理搭配结果时出错，请重试",
      } satisfies MealApiResponse,
      { status: 500 }
    );
  }
}
