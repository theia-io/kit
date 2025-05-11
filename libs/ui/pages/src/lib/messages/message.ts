export interface Message {
  severity?:
    | 'success'
    | 'info'
    | 'warn'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'contrast'
    | 'neutral'
    | string;
  summary?: string;
  detail?: string;
  id?: any;
  key?: string;
  life?: number;
  closable?: boolean;
  sticky?: boolean;
  data?: any;
  icon?: string;
  styleClass?: string;
}
// Done for migration from primeng to newer version
// Fix to Module '"primeng/api"' has no exported member 'Message'.
// Please review and adjust to policy how you use interfaces/classes in your codebase
// I prefer not to create a new interface for this, but rather use constants
