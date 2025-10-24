import { useState } from "nuxt/app"

export const usePlayerName = () => useState<string>("pName", () => "")
export const usePlayerName2 = () => useState<string>("pName2", () => "")