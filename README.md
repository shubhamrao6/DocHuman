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
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point
│   ├── index.css          # Tailwind CSS setup
│   └── ...                # Other source files
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

- **Main UI:** See `src/App.tsx` for the core application logic and UI.
- **Styling:** Tailwind CSS is used for rapid UI development. See `src/index.css` and `tailwind.config.js`.
- **Configuration:** Vite and TypeScript configs are in the root directory.
- **Linting:** ESLint is configured for code quality.

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
