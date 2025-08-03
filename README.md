# Rick & Morty Character Explorer

This project is a single-page application built with **React 18+, TypeScript, TanStack Query, Router, and Table**. It consumes the public [Rick and Morty API](https://rickandmortyapi.com/) to display a **paginated list of characters** and shows **character details** on a separate route.

## ✨ Features

- **Character Listing:** Paginated view of Rick & Morty characters.
- **Detail View:** Click on any character to see more details on a separate route.
- **Page Persistence:** Current page is persisted in the URL for sharing and refreshing.
- **Manual Refresh:** A refresh button allows manual re-fetching of the current page.
- **Modern React Stack:** Built using TanStack Query, Router, and Table for efficient data fetching, routing, and UI rendering.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/KeshavDussal/wipro-rick-morty-app.git
cd wipro-rick-morty-app
npm install
# or
yarn install
```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000/](http://localhost:3000/) in your browser.

---

## 📁 Project Structure

```
src/
├── api/                    # Data fetching logic using fetch and axios
│   ├── fetchCharacters.ts
│
├── pages/             # UI components
│   ├── CharacterDetailPage.tsx    # Character Detail Page
│   ├── CharacterListPage.tsx      # Character Listing Page
│   ├── CharacterListPageTypes.tsx # Types for both Pages
|
├── router/                 # Routes for list and detail pages
│   ├── index.tsx
│
├── routes/                 # Routes for list and detail pages
│   ├── character/$id.tsx   # File based routing for character detail
│   ├── index.tsx           # App component where we have called CharacterListPage
│
├── main.tsx                # Entry point
```

## 🧠 Tech Stack

- **React 18**
- **TypeScript**
- **TanStack Query** – For efficient and reactive data fetching/caching
- **TanStack Router** – Lightweight, type-safe routing
- **TanStack Table** – Table rendering with sorting and pagination logic

## 🔍 API Reference

- Public API: [https://rickandmortyapi.com/documentation](https://rickandmortyapi.com/documentation)
- Endpoints used:
  - `/character?page=n` – For character listing
  - `/character/:id` – For character detail

## ✅ Mandatory Functional Requirements

- [x] Fetch data from Rick & Morty API
- [x] Display paginated character list
- [x] Persist page in URL for refresh and sharing
- [x] Manual refresh of visible page
- [x] Character detail view on route `/character/:id`

## 📌 Notes

- This application focuses on functional implementation. Styling and animations are minimal and not part of the evaluation.
- The project is self-contained and requires no external backend or database.

## 📄 License

MIT

## Demo

![Form GIF Output](./public/wipro-rick-and-morty-output.gif)
