# DocHuman

DocHuman is a unified knowledge base application that transforms scattered documents into an intelligent, searchable resource. Powered by React, Vite, and Tailwind CSS, DocHuman enables users to upload files, connect data sources, and query their knowledge base for actionable insights.

## Features

- **Unified Knowledge Base:** Upload documents (PDF, CSV, TXT, EPUB, DOCX, XLS, PNG, JPEG) and connect external sources (Notion, Google Drive, SharePoint, Confluence).
- **Intelligent Querying:** Ask questions and receive AI-powered answers based on your uploaded and connected data.
- **Modern UI:** Responsive, clean interface built with React and Tailwind CSS.
- **Authentication:** Login via Google or email/password.
- **File Management:** Upload, view, and process multiple files at once.
- **Team Collaboration:** (UI placeholder for team features).
- **API & Settings:** (UI placeholders for future integrations).

## Architecture

DocHuman follows a modular architecture for maintainability and scalability:

### Component Structure
- **Modular Components:** Each screen is a separate, reusable component
- **Custom Hooks:** Business logic extracted into reusable hooks
- **Service Layer:** API and WebSocket services organized in dedicated modules
- **Utility Functions:** Common utilities for file handling and formatting

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn]

### Installation

1. **Clone the repository:**
	```powershell
	git clone https://github.com/savin-vish/DocHumanKnowledge.git
	cd DocHumanKnowledge
	```

2. **Install dependencies:**
	```powershell
	npm install
	# or
	yarn install
	```

### Running the Application

Start the development server:

```powershell
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production

```powershell
npm run build
# or
yarn build
```

### Preview Production Build

```powershell
npm run preview
# or
yarn preview
```

### Linting

```powershell
npm run lint
# or
yarn lint
```

## Project Structure

```
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── LandingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── QueryScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── Sidebar.tsx
│   │   └── UploadsScreen.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useFileHandling.ts
│   ├── services/          # API and business logic
│   │   ├── apiService.ts
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   ├── websocketService.ts
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── fileUtils.ts
│   ├── data/              # Mock data and types
│   │   └── mockData.ts
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind CSS setup
├── index.html             # HTML template
├── package.json           # Project metadata and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.ts         # Vite configuration
├── tsconfig*.json         # TypeScript configuration
└── README.md              # Project documentation
```

## Usage

1. **Login:** Use Google or email/password to sign in.
2. **Upload Files:** Supported formats include PDF, CSV, TXT, EPUB, DOCX, XLS, PNG, JPEG.
3. **Connect Data Sources:** (UI placeholders for Notion, Google Drive, SharePoint, Confluence).
4. **Query Knowledge Base:** Enter questions and receive AI-generated answers referencing your documents and sources.
5. **Export & Refine:** Refine results or export insights as needed.

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [ESLint](https://eslint.org/)

## Development

### Modular Architecture
- **Components:** Each screen is a separate component in `src/components/`
- **Hooks:** Business logic extracted into custom hooks in `src/hooks/`
- **Services:** API calls and WebSocket handling in `src/services/`
- **Utils:** Common utilities in `src/utils/`
- **Data:** Mock data and type definitions in `src/data/`

### Key Files
- **Main UI:** `src/App.tsx` - Clean routing and state management
- **Styling:** Tailwind CSS in `src/index.css` and `tailwind.config.js`
- **Configuration:** Vite and TypeScript configs in root directory
- **Linting:** ESLint configured for code quality

### Adding New Features
1. Create components in `src/components/`
2. Extract logic into hooks in `src/hooks/`
3. Add API calls to `src/services/`
4. Use utilities from `src/utils/`

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

*DocHuman – Transform your documents into actionable knowledge.*
DocHumanKnowledge
