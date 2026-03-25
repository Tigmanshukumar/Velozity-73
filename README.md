<div align="center">

# 📊 Project Tracker

**A multi-view task management system with List, Kanban, and Timeline views**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State-black?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://velozityproject.netlify.app/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 **List View** | Sortable table with status updates and virtual scrolling |
| 🧩 **Kanban Board** | Drag-and-drop tasks across columns without external libraries |
| 📅 **Timeline View** | Month-based timeline with start–end bars and single-day markers |
| ⚡ **State Management** | Global state powered by Zustand for seamless updates |
| � **Real-time UI Sync** | Changes reflect instantly across all views |
| 🎯 **Task Priorities** | Visual priority indicators (low → critical) |
| 📦 **Scalable Data** | Handles 500+ tasks efficiently |

---

## 🖼️ Screenshots

> Add your screenshots here (List / Kanban / Timeline)

---

## 🛠️ Tech Stack & Decisions

### State Management: Zustand
I chose **Zustand** for state management instead of React Context + `useReducer`. 
**Justification:**
- **Performance:** Zustand prevents unnecessary re-renders that typically plague Context API when deep component trees consume a large application state. Components only subscribe to the specific slices of state they need.
- **Boilerplate:** Context + `useReducer` requires a lot of boilerplate (providers, combined reducers, dispatch wrappers). Zustand allowed me to split logic naturally into a `useTaskStore`, `useFilterStore`, and `useCollabStore`, keeping the codebase clean and maintainable.
- **Outside-React Access:** Zustand allows reading and updating state outside of React components (e.g., handling generic event listeners or URL syncing) with ease.

---

## 🏎️ Custom Implementations (No Libraries)

### Virtual Scrolling
The virtual scrolling in the List View was implemented purely from scratch to handle 500+ tasks smoothly:
1. **Viewport Calculation:** I attached an `onScroll` listener to the scrolling container to track `scrollTop`.
2. **Visible Slice:** Based on the `scrollTop`, constant row height (`ROW_H`), and visible container height, I calculate a `start` and `end` index for the sorted tasks array. I also add a `BUFFER` of 5 rows above and below to prevent flickering during fast scrolls.
3. **DOM Manipulation:** Rather than rendering 500 DOM nodes, only the visible subset (e.g., ~15-20 rows) is rendered.
4. **Padding Rows:** To ensure the scrollbar accurately reflects the total height of the list, empty padding rows (`<tr>`) are rendered at the very top and very bottom of the table, dynamically adjusting their `height` styles based on the skipped offset.

### Drag-and-Drop Approach
The drag-and-drop interaction in the Kanban View was implemented without external libraries using native pointer/mouse/touch events:
1. **Event State:** When a user mouses down (or touches) a card, the `dragging` task and initial `pos` (X/Y coordinates) are stored in React state.
2. **Ghost Element:** A fixed-position "ghost" copy of the dragged card is rendered at the recorded X/Y coordinates to follow the cursor (`opacity: 0.8`, `pointerEvents: 'none'`).
3. **Drop Target Detection:** Instead of relying on HTML5 Drag API which lacks fine-grained mobile touch support, I use `document.elementFromPoint(x, y)` on global mousemove/touchmove to determine the current hovered column (`[data-col]`).
4. **Placeholder:** As the user drags, the appropriate drop zone is identified and its index is recorded, rendering a dashed placeholder seamlessly without causing layout shifts.
5. **Snap Back & Finalize:** Upon mouseup/touchend, the coordinates are cleared, dragging state is nullified, and the task's status is updated in the global store to reflect the new column.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd project-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to see the application.

### Build for Production
```bash
npm run build
```

---

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center"><b>Lighthouse</b></td>
     </tr>
  <tr>
    <td><img src="https://i.postimg.cc/MKf09xKr/Screenshot-(465).png" alt="Landing Page" width="400"/></td>
  </tr>
</table>

---
