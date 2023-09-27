import {Component, Prop, Host, h, Event, EventEmitter} from '@stencil/core';

export interface IColumn {
  id: string;
  header?: string;
  renderHeader?: (col: IColumn) => any;
  renderCell?: (col: IColumn, row: any) => any;
}

/**
 * Display a simple table of data. Columns and data cells may have custom renderers defined to
 * support creating interactive table layouts.
 */
@Component({
  tag: 'verdocs-table',
  styleUrl: 'verdocs-table.scss',
})
export class VerdocsTable {
  /**
   * The columns to display
   */
  @Prop() columns: IColumn[] = [];

  /**
   * The rows to display
   */
  @Prop() data: any[] = [];

  /**
   * Event fired when the user clicks a column header. This may be used to manage sorting options.
   */
  @Event({composed: true}) colHeaderClick: EventEmitter<{col: IColumn}>;

  /**
   * Event fired when the user clicks a row.
   */
  @Event({composed: true}) rowClick: EventEmitter<{row: any}>;

  render() {
    return (
      <Host class="table-wrapper">
        <table class="table">
          <thead>
            <tr class="row header-row">
              {this.columns.map((col, i) => {
                return (
                  <th
                    class={`col header-col col-${i} col-${col.id}`}
                    onClick={() => this.colHeaderClick?.emit({col})}
                    innerHTML={col.renderHeader ? col.renderHeader(col) : col.header || col.id}
                  />
                );
              })}
            </tr>
          </thead>

          <tbody>
            {this.data.map(row => (
              <tr class="row data-row" onClick={() => this.rowClick?.emit({row})}>
                {this.columns.map((col, i) => {
                  return <td class={`col data-col col-${i} col-${col.id}`}>{col.renderCell?.(col, row) || row[col.id]}</td>;
                  // return <td class={`col data-col col-${i} col-${col.id}`} innerHTML={col.renderCell?.(col, row) || row[col.id]} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Host>
    );
  }
}
