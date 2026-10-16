# 这一餐

帮助健康成年人快速决定「这一餐吃什么、吃多少」的 MVP。

## 功能

- 同屏选择餐次（默认按本地时段）与就餐方式
- 一键生成本餐搭配（主食、蛋白质、蔬菜 + 参考份量 + 指导）
- 每项食物「换一个」，仅替换同类并更新份量

## 本地运行

```bash
npm install
npm run dev
# 若出现 __webpack_modules__ / 缺少 chunk 等错误，先停掉所有 next dev，再：
npm run dev:clean
```

请勿同时开多个 `next dev`，也不要在 dev 运行时执行 `npm run build`（共用 `.next` 会导致模块缓存损坏）。

浏览器打开 [http://localhost:3000](http://localhost:3000)。

**不配置 API 密钥即可使用**：自动进入演示模式，从 `lib/demo-meals.ts` 的预设食谱生成与替换搭配。

若要启用 AI 搭配，复制 `.env.example` 为 `.env` 并填入 `OPENAI_API_KEY`。

## 环境变量

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥；留空则演示模式 |
| `OPENAI_MODEL` | 模型 ID，默认 `gpt-4o-mini` |
| `MEAL_DEMO_MODE` | `true` 强制演示；`false` 且无密钥时不走演示 |

AI 的 system 提示词见 `lib/meal-system-prompt.ts`，与用户选择一并 POST 至 `/api/meal`。
