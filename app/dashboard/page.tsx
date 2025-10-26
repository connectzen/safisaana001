"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Users, ShoppingCart, TrendingUp, Eye, Activity } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/lib/hooks"
import { getTotalVisits, getUniqueVisitors, getVisitsLast24Hours, getRecentVisits, getPageViewsBreakdown } from "@/lib/visitor-tracking"

export default function DashboardPage() {
  const { getProducts } = useProducts()
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [visitorStats, setVisitorStats] = React.useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    visitsLast24h: 0,
  })
  const [recentVisits, setRecentVisits] = React.useState<any[]>([])
  const [pageViews, setPageViews] = React.useState<any[]>([])

  React.useEffect(() => {
    async function loadData() {
      try {
        const [productsData, totalVisits, uniqueVisitors, visitsLast24h, visits, pages] = await Promise.all([
          getProducts(),
          getTotalVisits(),
          getUniqueVisitors(),
          getVisitsLast24Hours(),
          getRecentVisits(5),
          getPageViewsBreakdown(),
        ])
        
        setProducts(productsData)
        setVisitorStats({ totalVisits, uniqueVisitors, visitsLast24h })
        setRecentVisits(visits)
        setPageViews(pages)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalProducts = loading ? "..." : products.length.toString()
  const totalBundles = loading ? "..." : products.filter(p => p.type === 'bundle').length.toString()
  const activeProducts = loading ? "..." : products.filter(p => p.status === 'active').length.toString()

  const stats = [
    { 
      label: "Total Products", 
      value: totalProducts, 
      icon: Package, 
      color: "text-blue-600",
      description: "Digital products in store"
    },
    { 
      label: "Active Listings", 
      value: activeProducts, 
      icon: ShoppingCart, 
      color: "text-green-600",
      description: "Currently available"
    },
    { 
      label: "Unique Visitors", 
      value: loading ? "..." : visitorStats.uniqueVisitors.toString(), 
      icon: Users, 
      color: "text-purple-600",
      description: "Real users tracked"
    },
    { 
      label: "Total Revenue", 
      value: "$0", 
      icon: DollarSign, 
      color: "text-orange-600",
      description: "Coming soon"
    },
  ]

  const quickActions = [
    {
      title: "Add Product",
      description: "Upload new digital product",
      icon: Package,
      href: "/dashboard/products",
      color: "bg-blue-500",
    },
    {
      title: "View Analytics",
      description: "Track sales and performance",
      icon: TrendingUp,
      href: "/dashboard/analytics",
      color: "bg-purple-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Manage your digital products marketplace.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Quickly add or manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading recent activity...</p>
                </div>
              ) : (
                <>
                  {products.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{products.length} product{products.length !== 1 ? 's' : ''} in marketplace</p>
                        <p className="text-sm text-muted-foreground">Latest: {products[0]?.title || 'Untitled'}</p>
                      </div>
                    </div>
                  )}
                  {products.filter(p => p.type === 'bundle').length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{products.filter(p => p.type === 'bundle').length} bundle{products.filter(p => p.type === 'bundle').length !== 1 ? 's' : ''} available</p>
                        <p className="text-sm text-muted-foreground">Special pricing bundles</p>
                      </div>
                    </div>
                  )}
                  {products.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No products added yet. Start by adding digital products to your marketplace!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visitor Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recent Visitors
              </CardTitle>
              <CardDescription>Latest page visits</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading visitors...</p>
                </div>
              ) : recentVisits.length > 0 ? (
                <div className="space-y-3">
                  {recentVisits.map((visit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{visit.page}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(visit.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No visitors yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Popular Pages
              </CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading page views...</p>
                </div>
              ) : pageViews.length > 0 ? (
                <div className="space-y-3">
                  {pageViews.slice(0, 5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="font-medium text-sm truncate">{page.page}</p>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground ml-2">
                        {page.count} views
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No page views yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
