import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import * as $ from 'jquery';
import 'datatables.net';
import {environment} from '../../../../../../environments/environment';

const baseURL = environment.intact_portal_ws;

@Component({
  selector: 'iv-features-details',
  templateUrl: './features-details.component.html',
  styleUrls: ['./features-details.component.css']
})
export class FeaturesDetailsComponent implements OnInit, OnChanges {

  @Input() interactionAc: string;
  @Input() featureTab: boolean;

  @Output() featureChanged: EventEmitter<string> = new EventEmitter<string>();

  dataTable: any;
  columnView = 'features_columnView';

  private _columnNames: string[] = ['Ac', 'Name', 'Type', 'Role', 'Range Positions', 'Linked Features', 'Participant Name',
    'Participant Identifier', 'Participant Ac', 'Detection Methods', 'Parameters', 'Identifiers', 'Cross References', 'Annotations'];

  private _featureSelected: string;

  constructor() { }

  ngOnInit(): void {
    this.initDataTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.featureTab.currentValue) {

      // This fixes the alignment between the th and td when we have activated scrollX:true
      const table: any = $('#featureTable');
      this.dataTable = table.DataTable().columns.adjust().draw();
    }
  }

  private initDataTable(): void {
    const table: any = $('#featureTable');
    this.dataTable = table.DataTable({
      bSort: false,
      searching: false,
      paging: true,
      lengthMenu: [ 10, 25, 50, 75, 100 ],
      pageLength: 10,
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,
      dom: '<"top"li>rt<"bottom"p><"clear">',
      scrollX: true,
      ajax: {
        url: `${baseURL}/graph/features/datatables/` + this.interactionAc,
        type: 'POST',
        //   error: function(xhr, error, code) { console.log(error); },
        //   success: function(result) {console.log(JSON.stringify(result))},
        data: function ( d ) {
          d.page = d.start / d.length;
          d.pageSize = d.length;
        }
      },
      columns: [
        {data: 'participantName', defaultContent: ' ', title: 'Select',
          render: function (data, type, full, meta) {
            if (type === 'display') {
              return '<input type="checkbox" id="' + full.featureAc + '" name="check" value="' + data + '"/>';
            }
            return data;
          }
        },
        {data: 'featureAc', title: 'Ac'},
        {data: 'name', title: 'Name'},
        {data: 'type.shortName', title: 'Type'},
        {data: 'role', title: 'Role', defaultContent: ''},
        {data: 'ranges', title: 'Range Positions', defaultContent: '', render: '[, ]'},
        {data: 'linkedFeatures', title: 'Linked Features', defaultContent: '',
          render: function (data, type, row, meta) {
            if (type === 'display') {
              return $.map(data, function (d, i) {
                return '<div>' +
                          '<span class="detailsCell">' + d.shortName + '</span>' +
                       '</div>';
              }).join('');
            }
          }},
        {data: 'participantName', title: 'Participant Name', defaultContent: ''},
        {data: 'participant.identifier', title: 'Participant Identifier', defaultContent: ''},
        {data: 'participantAc', title: 'Participant Ac', defaultContent: ''},
        {data: 'detectionMethods', title: 'Detection Methods', defaultContent: '',
          render: function (data, type, row, meta) {
            if (type === 'display') {
              return $.map(data, function (d, i) {
                return '<div>' +
                         '<span class="detailsCell">' + d.shortName + '</span>' +
                       '</div>';
              }).join('');
            }
          }
        },
        {data: 'parameters', title: 'Parameters', defaultContent: '',
          render: function (data, type, row, meta) {
            if (type === 'display') {
              return $.map(data, function (d, i) {
                return '<div class="margin-bottom-medium">' +
                  '<span class="detailsCell">' + d.type.shortName + ':' + d.value + '(' + d.unit.shortName + ') </span>' +
                  '</div>';
              }).join('');
            }
          }},
        {data: 'identifiers', title: 'Identifiers', defaultContent: '',
          render: function (data, type, row, meta) {
            if (type === 'display') {
              return $.map(data, function (d, i) {
                return '<div class="margin-bottom-medium">' +
                      '<span class="detailsCell">' + d.database.shortName + ':' + d.identifier + '</span>' +
                      '</div>';
              }).join('');
            }
          }},
        {data: 'xrefs', title: 'Cross References', defaultContent: '',
          render: function (data, type, row, meta) {
            if (type === 'display') {
              return $.map(data, function (d, i) {
                return d.qualifier != null ?
                    '<div class="margin-bottom-medium">' +
                          '<span class="detailsXrefCell margin-right-medium">' +
                          '<i class="icon icon-common icon-tag"></i>  ' + d.qualifier.shortName + '</span>' +
                          '<span class="detailsCell">' + d.database.shortName + ':' + d.identifier + '</span>' +
                    '</div>'  :
                    '<div class="margin-bottom-medium">' +
                      '<span class="detailsCell">' + d.database.shortName + ':' + d.identifier + '</span>' +
                    '</div>';
              }).join('');
            }
          }},
        {data: 'annotations', title: 'Annotations', defaultContent: '',
          render: function ( data, type, row, meta ) {
            if (type === 'display') {
              return $.map(data, function (d, i) {
                 return '<div class="margin-bottom-medium">' +
                          '<span class="detailsAnnotationCell margin-right-medium">' +
                          ' <i class="icon icon-common icon-tag"></i>  ' + d.topic.shortName + '</span>' +
                        '<span class="detailsCell">' + d.description + '</span> ' +
                        '</div>';
              }).join('');
            }
          }}
      ],
      select: {
        style: 'os',
        className: 'rowSelected',
        selector: 'td:first-child'
      }
    });

    $('#featureTable').on('change', 'input[type=\'checkbox\']', (e) => {

      const featureSel = e.currentTarget.id;

      if (this.featureSelected !== featureSel) {
        $( '#' + this.featureSelected + ':checkbox').prop('checked', false);

        // TODO: To find another way to do the highlighting
        $(table.dataTableSettings).each(function () {
          $(this.aoData).each( function () {
            $(this.nTr).removeClass('rowSelected');
          })
        });

        this.featureSelected = featureSel;
        $(e.target.parentNode.parentNode).addClass('rowSelected');

        this.featureChanged.emit(this.featureSelected);

      } else {
        // None is selected, remove class
        this.featureSelected = undefined;
        $(table.dataTableSettings).each(function () {
          $(this.aoData).each( function () {
            $(this.nTr).removeClass('rowSelected');
          })
        });

        this.featureChanged.emit(this.featureSelected);
      }
    });
  }

  get columnNames(): string[] {
    return this._columnNames;
  }

  get featureSelected(): string {
    return this._featureSelected;
  }

  set featureSelected(value: string) {
    this._featureSelected = value;
  }
}