export const MenuComponents: Array<{
    text: string;
    href?: string;
    components?: Array<{ text: string; href: string }>;
}> = [
    { text: 'Class View', href: '/classview' },
    {
        text: 'Students',
        components: [
            { text: 'Profiles', href: '/students/profiles' },
            { text: 'Leadership', href: '/students/leadership' },
            { text: 'Tournaments', href: '/students/tournaments' },
            { text: 'Add Missing Class', href: '/students/addmissingclass' }
        ]
    },
    {
        text: 'Classes',
        components: [
            { text: 'Schedule', href: '/classes/schedule' },
            { text: 'Edit Classes', href: '/classes/editclasses' }
        ]
    },
    {
        text: 'Manage Studio',
        components: [
            { text: 'Belt Requirements', href: '/managestudio/beltrequirements' },
            { text: 'Print Student ID Card', href: '/managestudio/printstudentcards' }
        ]
    },
    // {
    //     text: 'Transactions',
    //     components: [
    //         { text: 'Payments', href: '/transactions/payments' },
    //         { text: 'Refunds', href: '/transactions/refunds' },
    //         { text: 'Memberships', href: '/transactions/memberships' }
    //     ]
    // },
    { text: 'Inventory', href: '/inventory' },
    // { text: 'Logs', href: '/logs' }
];