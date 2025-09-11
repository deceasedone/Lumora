# Lumora ✨

<div align="center">
  <h1>Your Personal Productivity & Relaxation Hub</h1>
  <p>
    Lumora is a full-stack application designed to reduce cognitive load by unifying 5+ core productivity tools and 10+ ambient soundscapes into a single, cohesive interface.
  </p>
  <p>
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#license"><strong>License</strong></a>
  </p>
</div>

---

## 🚀 Introduction

In a world filled with distractions, Lumora is your personal sanctuary for focus and calm. It's more than just a to-do list; it's an integrated environment that combines powerful productivity tools with immersive relaxation features. Whether you're working on a project, studying for an exam, or simply need a moment to unwind, Lumora provides a seamless experience to help you stay on track and find your flow.

The standout feature is the **Focus Lobby**, a real-time collaborative space where users can synchronize timers, chat, and join voice calls, making it perfect for group study sessions or co-working with peers.

## ✨ Features

Lumora is packed with features to enhance your productivity and well-being:

-   **Unified Dashboard**: Access all your tools from one clean interface.
    -   **Pomodoro Timer**: A classic time management tool to keep you focused.
    -   **To-Do List**: Organize your tasks and track your progress.
    -   **Journal**: A space for your thoughts, ideas, and reflections.
-   **Immersive Experience**:
    -   **Live Wallpapers**: Dynamic backgrounds to set the mood.
    -   **Ambient Soundscapes**: Over 10 high-quality ambient sounds (rain, forest, cafe, etc.) to help you concentrate or relax.
    -   **Music/YouTube Player**: Integrate your favorite focus music directly into your workspace.
-   **Real-time Focus Lobby**:
    -   Create or join rooms to work with others.
    -   **Synchronized Timers**: Everyone in the lobby follows the same Pomodoro or custom timer.
    -   **Live Chat**: Communicate with your peers without leaving the app.
    -   **Voice Calls**: Hop on a voice call for seamless collaboration, powered by LiveKit.
-   **Radical Customization**:
    -   Instantly reskin the entire UI with a single click.
    -   Choose from 5+ distinct themes, built on an efficient CSS variable architecture.

## 🛠️ Tech Stack

Lumora is built with a modern, robust, and scalable tech stack:

-   **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Zustand (for state management)
-   **Backend**: Node.js
-   **Database**: PostgreSQL
-   **Real-time Communication**: LiveKit (for WebSockets, chat, and voice)
-   **Styling**: CSS Variables for theming

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed on your machine.
-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/deceasedone/Lumora.git
    ```
2.  **Navigate to the project directory**
    ```sh
    cd Lumora
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up environment variables**
    -   Create a `.env.local` file in the root of the project.
    -   Add the necessary environment variables for your database, LiveKit, and any other services. You can use `.env.example` as a template.
    ```env
    # Example
    DATABASE_URL="your_postgresql_connection_string"
    LIVEKIT_API_KEY="your_livekit_api_key"
    LIVEKIT_API_SECRET="your_livekit_api_secret"
    ```
5.  **Run the development server**
    ```sh
    npm run dev
    ```
   
## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ by Gaurav Sinha
</div>
