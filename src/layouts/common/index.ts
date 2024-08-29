import { ListBulletIcon, ActivityLogIcon } from '@radix-icons/vue'

/**
 * * routeNames   - highlight for all route in array / redirect to first entry in array
 * * name / icon - Display
 * 
 * ! subMenu - not implemented
 */

export const sidebarData = [
    {
        routeNames: ['to-do-list'],
        name: 'title.to-do-list',
        icon: ListBulletIcon,
        subMenu: null
    },
    {
        routeNames: ['log'],
        name: 'title.log',
        icon: ActivityLogIcon,
        subMenu: null
    }
]

export { default as Sidebar } from './Sidebar.vue'
