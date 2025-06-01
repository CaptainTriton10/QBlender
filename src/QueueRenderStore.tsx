import { create } from "zustand";
import Render from "./handlers/RenderHandler";

export const useRenderQueue = create((set) => ({
    renderQueue: [],
    addRender: (render: Render) => set((state: any) => ({
        renderQueue: state.renderQueue.push(render)
    })),
}))