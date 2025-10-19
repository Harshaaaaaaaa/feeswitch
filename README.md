# Welcome to your Highlight project

## How can I edit this code?

There are several ways of editing your application.

**Use Highlight**

Changes made via Highlight will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Highlight.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🔗 Wallet Connection

The workspace automatically chooses the best wallet connection method:

### With Privy (Enhanced Experience)
Set these environment variables for full Privy integration:
```bash
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_PRIVY_CLIENT_ID=your_privy_client_id
```
**Features**: Embedded wallets, social login, seamless UX

### Without Privy (Standard Experience)  
No configuration needed - automatically falls back to an injected provider
**Features**: Standard wallet connection, works with all major wallets

### Unified API
Components use a single `useWallet()` hook that works with both providers:

```typescript
const { address, isConnected, connect, disconnect } = useWallet()
// Works identically whether using Privy or an injected provider!
```

## How can I deploy this project?

## Can I connect a custom domain to my Highlight project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.
