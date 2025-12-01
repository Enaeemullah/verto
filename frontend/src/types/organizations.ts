export interface Organization {
  id: string;
  por_orgadesc: string;
  por_orgacode: string;
  por_active: 'active' | 'inactive';
}

export type OrganizationInput = Pick<Organization, 'por_orgadesc' | 'por_orgacode' | 'por_active'>;
