import { ClerkClient } from '@clerk/backend';

export type OrganizationListParams = Parameters<
  ClerkClient['organizations']['getOrganizationList']
>[0];

export type UpdateOrganizationParams = Parameters<
  ClerkClient['organizations']['updateOrganization']
>[1];

export type CreateOrganizationParams = Parameters<
  ClerkClient['organizations']['createOrganization']
>[0];

export type UpdateOrganizationMetadataParams = Parameters<
  ClerkClient['organizations']['updateOrganizationMetadata']
>[1];
