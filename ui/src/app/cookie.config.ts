import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { environment } from '../environments/environment';

export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.production ? 'kitouch.io' : 'localhost', // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  position: 'bottom',
  theme: 'edgeless',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#f1d600',
      text: '#000000',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message:
      'We at Kitouch use cookies to ensure you get the best experience on our website.',
    dismiss: 'sure',
    deny: 'Refuse cookies',
    link: 'check it out',
    href: 'https://kitouch.io/cookie',
    policy: 'Cookie Policy',
  },
};
