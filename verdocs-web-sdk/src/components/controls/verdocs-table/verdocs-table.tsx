import {Component, Prop, Host, h} from '@stencil/core';

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

  render() {
    return (
      <Host class="table-wrapper">
        <table class="table">
          <thead>
            <tr class="row header-row">
              {this.columns.map((col, i) => {
                return <th class={`col header-col col-${i} col-${col.id}`} innerHTML={col.renderHeader ? col.renderHeader(col) : col.header || col.id} />;
              })}
            </tr>
          </thead>

          <tbody>
            {this.data.map(row => (
              <tr class="row data-row">
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
