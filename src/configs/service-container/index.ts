type ServiceFactory<T> = () => T;

interface ServiceEntry<T> {
  singleton: boolean;
  instance?: T;
  factory: ServiceFactory<T>;
}

export class ServiceContainer {
  private readonly container = new Map<string, ServiceEntry<any>>();

  singleton<T>(key: string, factory: ServiceFactory<T>): void {
    this.container.set(key, { singleton: true, factory });
  }

  transient<T>(key: string, factory: ServiceFactory<T>): void {
    this.container.set(key, { singleton: false, factory });
  }

  get<T>(key: string): T {
    const entry = this.container.get(key);
    if (!entry) {
      throw new Error(`Service "${key}" not found`);
    }

    if (entry.singleton) {
      if (!entry.instance) {
        entry.instance = entry.factory();
      }
      return entry.instance;
    }

    return entry.factory();
  }

  has(key: string): boolean {
    return this.container.has(key);
  }

  clear(): void {
    this.container.clear();
  }
}
