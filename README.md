
# 🍳 BiteBuilder – Personalized Cooking System (2024)

**BiteBuilder** is a **full-stack AI-driven cooking management platform** that helps users plan, organize, and enhance their cooking experience.  
It offers **intelligent recipe search**, **ingredient-based discovery**, **drag-and-drop meal planning**, and a **smart grocery list generator** — all powered by AI and optimized data structures.

---

## 🚀 Features

- 🧠 **AI-Powered Cooking Assistant** — Uses **Gemini API** for personalized recommendations and context-aware meal suggestions.  
- 🍽️ **Recipe & Ingredient Search** — Integrated with the **Spoonacular API** to fetch thousands of real recipes and ingredients.  
- 📋 **Smart Grocery List Generation** — Automatically compiles ingredients based on selected recipes and meal plans.  
- 🧩 **Drag-and-Drop Meal Planner** — Intuitive UI for building custom weekly meal plans.  
- ⚡ **Optimized Search Engine** — Implements a **Binary Search Tree (BST)** for faster recipe and ingredient lookup, improving response times and efficiency.  
- 🌐 **Full-Stack Integration** — Real-time syncing of user data, preferences, and grocery lists.  

---

## 🧰 Tech Stack

| Layer | Technology Used |
|-------|-----------------|
| **Frontend** | React.js + Vite |
| **Styling** | TailwindCSS + shadcn/ui components |
| **Backend / Database** | Supabase |
| **APIs** | Spoonacular API (recipes), Gemini API (AI recommendations) |
| **Data Structures** | Binary Search Tree (BST) for search optimization |

---

## 🧠 How It Works

1. Users search or select recipes via **Spoonacular API**.  
2. Recipe and ingredient data are stored and indexed in a **BST** to allow quick lookup and filtering.  
3. The **Gemini API** provides AI-generated meal recommendations and substitutions.  
4. Users can **drag and drop** meals into a weekly planner.  
5. The system generates a **smart grocery list** dynamically from all planned recipes.  
6. All data syncs in real-time using **Supabase** for a seamless experience.

---

## 🧩 Architecture Overview

