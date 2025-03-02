//production
// const currentDomain = extractDomainWithoutSubdomains(window.location.hostname);
const currentDomain = 'bas-mart.com'
const BASE_URL = `https://service.${currentDomain}`
const BASE_URL_WOP = `https://${currentDomain}/accountimg`
const AUTH_BASE_URL = `https://service.${currentDomain}`


// development
// const BASE_URL = `https://service.${currentDomain}`
// const BASE_URL_WOP = `https://${currentDomain}/accountimg`
// const AUTH_BASE_URL = `https://service.${currentDomain}`

// const currentDomain = 'localhost'
// const BASE_URL = 'http://174.138.123.234:7004'
// const BASE_URL_WOP = 'http://174.138.123.234'
// const AUTH_BASE_URL = 'http://174.138.123.234:7004'

// const currentDomain = 'http://174.138.123.234'
// const BASE_URL = 'http://localhost:8000'
// const BASE_URL_WOP = 'http://localhost'
// const AUTH_BASE_URL = `http://localhost:8000`

const Constants = {
        DOMAIN: currentDomain,
        BASE_URL: BASE_URL,
        AUTH_BASE_URL: AUTH_BASE_URL,
        BASE_URL_WOP: BASE_URL_WOP,
        BASE_PATH: "/",
        ACCOUNT_ID: "",
        USER_GROUP: 1,
        Application: "b2b",
        CREATE_MODE: "create",
        UPDATE_MODE: "update",
        DELETE_MODE: "delete",
        UPLOAD_MODE: "upload",
        OTP_EMAIL: 'email',
        OTP_PHONE: 'phone',
        VIEW_MODE: "view",
        AUTO_ASSIGN: false,
        INPUT: {
                TextInput: 'text',
                LongTextInput: 'textarea',
                SelectList: 'select'
        },
        MODULES: {
                Leads: 'crm_leads',
                Profile: 'user',
                Address: 'address_information',
                Cart: 'cart',
                Product: 'product',
                Orders: 'invoice',
                OrderDetail: 'order_detail',
                OrderTrack: 'order_track',
                OneTimePassword: 'one_time_password',
                SystemReference: 'system_reference',
                Document: 'document',
                Template: 'template',
                TemplatesField: 'templates_field',
                PartnerAccount: 'partner_account',
                ProjectAccount: 'project_account',
                LocationCity: 'location_city',
                LocationState: 'location_state',
                WorkflowStatus: 'workflow_status',
                Category: 'category_new',
                TaskLog: 'task_log',
                Teams: 'teams',
        },
        MARKETPLACE: 'marketplace'

}

function extractDomainWithoutSubdomains(domains) {
        // Split the domain by dots and return the last part
        const parts = domains.split('.');
        return parts[parts.length - 2] + '.' + parts[parts.length - 1];
      }

export default Constants;