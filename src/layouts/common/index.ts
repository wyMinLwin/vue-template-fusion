import { ListBulletIcon, ActivityLogIcon, ViewGridIcon, CameraIcon, FileTextIcon } from '@radix-icons/vue'

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
    },
    {
        routeNames: ['viewers'],
        name: 'title.viewers',
        icon: ViewGridIcon,
        subMenu: null
    },
    {
        routeNames: ['camera'],
        name: 'title.camera',
        icon: CameraIcon,
        subMenu: null
    },
    {
        routeNames: ['segments'],
        name: 'title.segments',
        icon: FileTextIcon,
        subMenu: null
    },
    {
        routeNames: ['text-to-speech'],
        name: 'title.text-to-speech',
        icon: FileTextIcon,
        subMenu: null
    },
    {
        routeNames: ['speech-to-text'],
        name: 'title.speech-to-text',
        icon: FileTextIcon,
        subMenu: null
    },
]

export { default as Sidebar } from './Sidebar.vue'
