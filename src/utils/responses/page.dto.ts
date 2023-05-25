export class PageDto<T> {
  constructor(items: T[], meta: PageMetaDto) {
    this.items = items;
    this.meta = meta;
  }
  readonly items: T[];

  readonly meta: PageMetaDto;
}

export class PageMetaDto {
  constructor(options: PageMetaDtoParams) {
    (this.page = options.page),
      (this.take = options.take),
      (this.toal = options.total);
  }
  readonly page: number;

  readonly take: number;

  readonly toal: number;
}

interface PageMetaDtoParams {
  page: number;
  take: number;
  total: number;
}
