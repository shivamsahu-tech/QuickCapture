import { Note } from "./types/Notes";

const matteColors = [
    '#B0C8E6', // Darker Light Blue
    '#DBA9C3', // Darker Light Pink
    '#D3C171', // Darker Light Yellow
    '#8DBDA2', // Darker Light Green
    '#D9B8A9', // Darker Light Peach
    '#A09FC5', // Darker Light Lavender
    '#D09685', // Darker Soft Coral
    '#8CB297', // Darker Pale Mint
    '#D4B172', // Darker Soft Gold
    '#A9ABB4', // Darker Cool Gray
    '#C9A37D', // Darker Warm Beige
    '#94BADE', // Darker Light Sky Blue
    '#BAC98E', // Darker Soft Lime
    '#D19BA3', // Darker Pale Pink Rose
    '#A2A6BA', // Darker Pale Slate Blue
    '#98C0AA'  // Darker Light Aquamarine
];

export const GuestNotes: Note[] = [
    {
        id: '0',
        title: 'Showcase Notes',
        type: 'Info',
        text: 'These are prebuilt notes for demonstration purposes. Creating a new note using the "+" icon will remove all showcase notes.',
        color: matteColors[4] // Darker Light Peach
    },
    {
        id: '1',
        title: 'OTP-Based Authentication',
        type: 'Important',
        text: 'The app includes a robust OTP-based authentication system, ensuring user verification during sign-up and login, with a confirm password step and a secure "Forgot Password" flow.',
        color: matteColors[10] // Darker Warm Beige
    },
    {
        id: '3',
        title: 'Enhanced Text Editor',
        type: 'General',
        text: 'An intuitive text editor page that supports rich text formatting and offers a seamless note-taking experience with a clean design.',
        color: matteColors[7] // Darker Pale Mint
    },
    {
        id: '4',
        title: 'Horizontal Note Cards',
        type: 'Important',
        text: 'Notes are displayed in a Pinterest-like horizontal card layout with a modern design using matte finish colors.',
        color: matteColors[13] // Darker Pale Pink Rose
    },
    {
        id: '5',
        title: 'Categorized Notes',
        type: 'Starred',
        text: 'Allows notes to be organized into categories, enabling quick access and efficient content management.',
        color: matteColors[3] // Darker Light Green
    }
];
