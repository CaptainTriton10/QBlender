import { create } from "zustand";
import Render from "./handlers/RenderHandler";

export type RenderQueue = {
    renderQueue: Render[];
    addRender: (render: Render) => void;
    updateQueue: (updatedQueue: Render[]) => void;
}

export const useRenderQueue = create<RenderQueue>((set) => ({
    renderQueue: [],
    addRender: (render: Render) => set((state: RenderQueue) => ({
        renderQueue: [...state.renderQueue, render]
    })),
    updateQueue: (newQueue: Render[]) => set((_state) => ({
        renderQueue: newQueue
    }))

}))