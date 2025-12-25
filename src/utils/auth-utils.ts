import { UserRole } from "@/types/common"

export type RouteConfig = {
  exact: string[]
  patterns: RegExp[]
}

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/settings"],
  patterns: [] // e.g. /password/change-password, /password/*
}

export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/admin(\/.*)?$/]
}

export const doctorProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/doctor(\/.*)?$/]
}

export const patientProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/dashboard(\/.*)?$/]
}

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some(route => route === pathname)
}

export const isRouteMatch = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.length > 0) {
    return routes.exact.includes(pathname)
  }
  return routes.patterns.some(pattern => pattern.test(pathname))
}

export const getRouteOwner = (pathname: string): "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
  if (isRouteMatch(pathname, adminProtectedRoutes)) {
    return "ADMIN"
  }
  if (isRouteMatch(pathname, doctorProtectedRoutes)) {
    return "DOCTOR"
  }
  if (isRouteMatch(pathname, patientProtectedRoutes)) {
    return "PATIENT"
  }
  if (isRouteMatch(pathname, commonProtectedRoutes)) {
    return "COMMON"
  }
  return null
}

export const getDefaultDashboardRoute = (user: UserRole): string => {
  if (user === "ADMIN") {
    return "/admin/dashboard"
  }
  if (user === "DOCTOR") {
    return "/doctor/dashboard"
  }
  if (user === "PATIENT") {
    return "/dashboard"
  }
  return "/"
}

export const isValidRouteForRole = (pathname: string, userRole: UserRole) => {
    const routeOwner = getRouteOwner(pathname)
    if (routeOwner === "COMMON") {
        return true
    }
    if (routeOwner !== userRole) {
        return false
    }
    return true
}