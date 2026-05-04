# Privacy Notice – Matrix Software Implementation

## Overview
The Matrix Software Implementation is a mathematical library and web API that provides matrix operations. This privacy notice explains how we handle data in our application, even though it collects minimal information.

## Data Collection and Usage

### No Personal Data Collection
This application **does not collect, store, or process any personal information** about users. There are no user accounts, registration forms, or personal data fields.

### API Request Data
When using the REST API endpoints, users may send matrix data in HTTP request bodies:

**Data Collected:**
- Matrix numerical data submitted to API endpoints (`/add`, `/multiply`, `/transpose`, `/determinant`, `/inverse`)
- HTTP request metadata (IP address, User-Agent, request timestamps)

**Purpose:**
- To perform the requested matrix calculations
- To provide the mathematical results to the user
- To log basic request information for debugging and monitoring

**Data Retention:**
- Matrix calculation data: Processed in memory only, not stored on disk
- Request logs: May be retained temporarily in server logs for debugging purposes
- Log retention: Maximum 30 days, after which logs are automatically rotated/deleted

### Web Interface Data
When accessing the web interface (`/`), basic web server logs may include:
- IP address
- Browser type and version
- Request timestamps
- HTTP status codes

## Data Security Measures

### Encryption
- All data transmission uses HTTPS/TLS encryption
- No sensitive data is transmitted (only mathematical matrices)

### Access Controls
- API endpoints are protected by authentication tokens
- Server access is restricted to authorized personnel only
- Environment variables and secrets are properly secured

### Data Minimization
- Only essential data for calculations is accepted
- No unnecessary data collection or storage
- Stateless design - no persistent user data storage

## User Rights

### Access Rights
- Users have the right to access the service anonymously
- No personal accounts or data to access

### Data Portability
- Since no personal data is stored, there is no data to export
- API responses contain only the calculation results requested

### Data Deletion
- No personal data exists to delete
- Request logs are automatically deleted after 30 days

### Right to Object
- Users may choose not to use the service
- No tracking or profiling occurs

## Third-Party Services

### Hosting Provider (Vercel)
- Request logs may be collected by Vercel as part of their hosting service
- Vercel's privacy policy: https://vercel.com/legal/privacy-policy
- Data processing complies with GDPR and other privacy regulations

### Development Tools
- GitHub may collect usage analytics for repository access
- GitHub's privacy policy: https://docs.github.com/en/github/site-policy/github-privacy-statement

## Cookies and Tracking

### No Cookies Used
This application does not use cookies or any client-side tracking mechanisms.

### No Analytics
No analytics services or tracking pixels are implemented.

## Data Processing Location

- Data processing occurs in Vercel's data centers
- Primary region: United States
- Data may be processed in other regions for redundancy

## Changes to This Privacy Notice

This privacy notice may be updated as the application evolves. Significant changes will be documented in the repository's change log.

## Contact Information

For privacy-related questions or concerns:
- Open an issue on the GitHub repository
- Contact the project maintainers through GitHub

## Compliance

This application complies with:
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Other applicable privacy regulations

Since no personal data is collected or processed, most privacy regulation requirements are not applicable.

## Last Updated
May 4, 2026