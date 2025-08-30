# Invoice Generator

A modern, user-friendly invoice generator built with Next.js and React. Create, manage, and download professional invoices in PDF format with ease.

## Features

- 📝 Create and manage invoice items with description, pieces, carats, and price
- 👥 Manage sender and recipient addresses
- 💰 Automatic calculation of subtotals and totals
- 💾 Local storage support for sender address
- 📄 Generate and download professional PDF invoices
- 🎨 Modern and responsive UI built with Tailwind CSS
- ✨ Smooth animations and transitions
- 🌐 Built with TypeScript for type safety

## Tech Stack

- **Framework**: Next.js 15.5
- **UI Library**: React 19.1
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: jsPDF
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript
- **State Management**: React Hooks + Local Storage

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/invoice-generator.git
cd invoice-generator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Set Sender Address**: Click "Edit" in the From section to set your company details
2. **Add Recipient**: Click "Add" in the To section to add customer details
3. **Add Invoice Items**: Click "Add Item" to add items with description, pieces, carats, and price
4. **Generate PDF**: Click "Download PDF" to generate and download the invoice

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
  - `/invoice` - Invoice-specific components
  - `/ui` - Reusable UI components
- `/lib` - Utility functions and custom hooks
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
