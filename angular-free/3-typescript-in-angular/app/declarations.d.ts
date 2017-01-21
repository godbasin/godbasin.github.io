type TODO = any;

declare var require: {
    (path: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => any) => void) => void;
};

interface MyWindow extends Window{
    isPluginLoaded: boolean;
    pluginLoaded: () => void;
    pendingFunctions: (() => void)[];
    makeToast: (text :string, type ?: string, duration ?: number) => void;
    addVideoPlugin: (videoType: number) => void;
    SERVICE_CONFIG: any;
    offlineBMap: boolean;
    BMap_loadScriptTime: number;
}

declare var app: any;

declare var PNotify: any;
declare var Switchery: any;
declare var JQuery: any;

declare var MozWebSocket: any;
declare var SockJS: any;

interface ArrayConstructor{
    from<T>(arrayLike: {length: number}, mapFun ?: (i, j) => T, thisArg ?: any): Array<T>;
}

interface Ojbect{
    assign<T>(target: T, ...source): T;
}