import { serverFetch, type PageResponse } from "@/lib/api/server";

export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export interface AdminUser {
  id: string;
  email: string;
  documentNumber: string;
  fullName: string;
  status: UserStatus;
  locked: boolean;
  roles: string[];
  lastLoginAt: string | null;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
  system: boolean;
  permissions: string[];
}

export interface Permission {
  code: string;
  resource: string;
  action: string;
  description: string | null;
}

export function listUsers(query?: string, page = 0): Promise<PageResponse<AdminUser>> {
  const params = new URLSearchParams({ page: String(page), size: "20" });
  if (query) {
    params.set("query", query);
  }
  return serverFetch<PageResponse<AdminUser>>(`/admin/users?${params}`);
}

export function listRoles(): Promise<Role[]> {
  return serverFetch<Role[]>("/admin/roles");
}

export function listPermissions(): Promise<Permission[]> {
  return serverFetch<Permission[]>("/admin/permissions");
}

/** Agrupa el catalogo por recurso, que es como se lee la matriz en pantalla. */
export function groupByResource(permissions: Permission[]): Map<string, Permission[]> {
  const grouped = new Map<string, Permission[]>();
  for (const permission of permissions) {
    const current = grouped.get(permission.resource) ?? [];
    current.push(permission);
    grouped.set(permission.resource, current);
  }
  return grouped;
}
