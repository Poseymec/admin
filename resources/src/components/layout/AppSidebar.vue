<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar dark:custom-scrollbar-dark"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(group, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-5 text-gray-400',
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ group.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, itemIndex) in group.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, itemIndex)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, itemIndex),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, itemIndex),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, itemIndex)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                  >
                    {{ item.translatedName }}
                  </span>
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, itemIndex),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                  >
                    {{ item.translatedName }}
                  </span>
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, itemIndex) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.translatedName }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(subItem.path),
                                  'menu-dropdown-badge-inactive': !isActive(subItem.path),
                                },
                              ]"
                            >
                              {{ t('sidebar.badges.new') }}
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(subItem.path),
                                  'menu-dropdown-badge-inactive': !isActive(subItem.path),
                                },
                              ]"
                            >
                              {{ t('sidebar.badges.pro') }}
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  HorizontalDots,
  ChevronDownIcon,
} from '../../icons'
import BoxCubeIcon from '@/icons/BoxCubeIcon.vue'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const { t } = useI18n()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()

// ✅ Menu dynamique avec traductions
const menuGroups = computed(() => [
  {
    title: t('sidebar.menu.main.title'),
    items: [
      {
        icon: GridIcon,
        name: 'dashboard',
        translatedName: t('sidebar.menu.main.items.dashboard'),
        subItems: [
          {
            name: 'home',
            translatedName: t('sidebar.menu.main.subitems.home'),
            path: '/',
            pro: false
          }
        ],
      },
      {
        icon: CalenderIcon,
        name: 'calendar',
        translatedName: t('sidebar.menu.main.items.calendar'),
        path: '/calendar',
      },
      {
        icon: UserCircleIcon,
        name: 'profile',
        translatedName: t('sidebar.menu.main.items.profile'),
        path: '/profile',
      },
      {
        name: 'products',
        icon: ListIcon,
        translatedName: t('sidebar.menu.main.items.products'),
        subItems: [
          {
            name: 'product_categories',
            translatedName: t('sidebar.menu.main.subitems.product_categories'),
            path: '/category-products/add',
            pro: false
          },
          {
            name: 'category_list',
            translatedName: t('sidebar.menu.main.subitems.category_list'),
            path: '/category-list',
            pro: false
          },
        ],
      },
      {
        name: 'tables',
        icon: TableIcon,
        translatedName: t('sidebar.menu.main.items.tables'),
        subItems: [
          {
            name: 'basic_tables',
            translatedName: t('sidebar.menu.main.subitems.basic_tables'),
            path: '/basic-tables',
            pro: false
          },
        ],
      },
      {
        name: 'pages',
        icon: PageIcon,
        translatedName: t('sidebar.menu.main.items.pages'),
        subItems: [
          {
            name: 'blank_page',
            translatedName: t('sidebar.menu.main.subitems.blank_page'),
            path: '/blank',
            pro: false
          },
          {
            name: 'page_404',
            translatedName: t('sidebar.menu.main.subitems.page_404'),
            path: '/error-404',
            pro: false
          },
          {
            name: 'users',
            translatedName: t('sidebar.menu.main.subitems.users'),
            path: '/users-list',
            pro: false
          },
        ],
      },
    ],
  },
  {
    title: t('sidebar.menu.others.title'),
    items: [
      {
        icon: PieChartIcon,
        name: 'charts',
        translatedName: t('sidebar.menu.others.items.charts'),
        subItems: [
          {
            name: 'line_chart',
            translatedName: t('sidebar.menu.others.subitems.line_chart'),
            path: '/line-chart',
            pro: false
          },
          {
            name: 'bar_chart',
            translatedName: t('sidebar.menu.others.subitems.bar_chart'),
            path: '/bar-chart',
            pro: false
          },
        ],
      },
      {
        icon: BoxCubeIcon,
        name: 'ui_elements',
        translatedName: t('sidebar.menu.others.items.ui_elements'),
        subItems: [
          { name: 'alerts', translatedName: t('sidebar.menu.others.subitems.alerts'), path: '/alerts', pro: false },
          { name: 'avatars', translatedName: t('sidebar.menu.others.subitems.avatars'), path: '/avatars', pro: false },
          { name: 'badge', translatedName: t('sidebar.menu.others.subitems.badge'), path: '/badge', pro: false },
          { name: 'buttons', translatedName: t('sidebar.menu.others.subitems.buttons'), path: '/buttons', pro: false },
          { name: 'images', translatedName: t('sidebar.menu.others.subitems.images'), path: '/images', pro: false },
          { name: 'videos', translatedName: t('sidebar.menu.others.subitems.videos'), path: '/videos', pro: false },
        ],
      },
      // Décommente si tu veux l’auth dans le menu
      /*
      {
        icon: PlugInIcon,
        name: 'authentication',
        translatedName: t('sidebar.menu.others.items.authentication'),
        subItems: [
          { name: 'signin', translatedName: t('sidebar.menu.others.subitems.signin'), path: '/signin', pro: false },
          { name: 'signup', translatedName: t('sidebar.menu.others.subitems.signup'), path: '/signup', pro: false },
          { name: 'forgot_password', translatedName: t('sidebar.menu.others.subitems.forgot_password'), path: '/forgot-password', pro: false },
          { name: 'reset_password', translatedName: t('sidebar.menu.others.subitems.reset_password'), path: '/reset-password', pro: false },
          { name: 'verify_email', translatedName: t('sidebar.menu.others.subitems.verify_email'), path: '/verify-email', pro: false }
        ],
      },
      */
    ],
  },
])

const isActive = (path) => route.path === path

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  )
})

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  const item = menuGroups.value[groupIndex]?.items[itemIndex]
  if (!item?.subItems) return false

  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value && item.subItems.some((subItem) => isActive(subItem.path)))
  )
}

const startTransition = (el) => {
  el.style.height = 'auto'
  const height = el.scrollHeight
  el.style.height = '0px'
  el.offsetHeight
  el.style.height = height + 'px'
}

const endTransition = (el) => {
  el.style.height = ''
}
</script>
