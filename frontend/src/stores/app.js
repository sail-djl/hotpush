import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = '/api'

export const useAppStore = defineStore('app', () => {
    // State - 默认 13 个内置数据源
    const stats = ref({ sources_count: 13, configured_channels: 0 })
    const lastUpdate = ref('')
    const refreshTrigger = ref(0)
    
    // 每个数据源展示的条数，默认 10，持久化到 localStorage
    const itemsPerSource = ref(
        parseInt(localStorage.getItem('hotpush_items_per_source') || '10')
    )

    // Actions
    const fetchStats = async () => {
        try {
            // /api/stats 是公开接口，无需认证
            const response = await fetch(`${API_BASE}/stats`)
            if (response.ok) {
                stats.value = await response.json()
            } else {
                console.error('Failed to fetch stats:', response.status)
            }
        } catch (e) {
            console.error('Failed to fetch stats:', e)
        }
    }

    const updateLastRefresh = () => {
        lastUpdate.value = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const triggerRefresh = () => {
        refreshTrigger.value++
        updateLastRefresh()
    }

    // 设置每个数据源展示的条数
    const setItemsPerSource = (count) => {
        itemsPerSource.value = count
        localStorage.setItem('hotpush_items_per_source', String(count))
    }

    return {
        stats,
        lastUpdate,
        refreshTrigger,
        itemsPerSource,
        fetchStats,
        updateLastRefresh,
        triggerRefresh,
        setItemsPerSource
    }
})
