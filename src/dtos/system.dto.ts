export type LogRquestType = 'warning' | 'success' | 'error' | 'info';

export interface LogRequestDTO {
    type?: LogRquestType,
    label?: string,
    data: any, 
}