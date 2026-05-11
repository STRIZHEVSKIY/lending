import { onRequest as __go__platform__js_onRequest } from "C:\\Users\\rmfan\\OneDrive\\Рабочий стол\\ИИ\\Goga\\functions\\go\\[platform].js"
import { onRequest as __stats_js_onRequest } from "C:\\Users\\rmfan\\OneDrive\\Рабочий стол\\ИИ\\Goga\\functions\\stats.js"

export const routes = [
    {
      routePath: "/go/:platform",
      mountPath: "/go",
      method: "",
      middlewares: [],
      modules: [__go__platform__js_onRequest],
    },
  {
      routePath: "/stats",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__stats_js_onRequest],
    },
  ]