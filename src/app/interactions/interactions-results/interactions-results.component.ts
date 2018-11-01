import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

import 'rxjs/add/operator/filter';
import { InteractorsSearchResult } from '../shared/model/interactions-results/interactor/interactors-search.model';
import { InteractorsSearchService } from '../shared/service/interactors-search.service';
import {InteractionsSearchResult} from '../shared/model/interactions-results/interaction/interactions-search.model';
import {InteractionsSearchService} from '../shared/service/interactions-search.service';

declare const $: any;

@Component({
  selector: 'iv-interactions-results',
  templateUrl: './interactions-results.component.html',
  styleUrls: ['./interactions-results.component.css']
})
export class InteractionsResultsComponent implements OnInit {

  private _term: string;
  private _speciesNameFilter: string[];
  private _interactorTypeFilter: string[];

  private _interactionTypeFilter: string[];
  private _detectionMethodFilter: string[];
  private _interactionSpeciesFilter: string[];
  private _organismFilter: string[];
  private _negativeFilter: boolean;
  private _miScoreMin: any;
  private _miScoreMax: any;

  private _currentPageIndex: number;

  // private _miScoreFilter: string[];

  private _interactorsSearch: InteractorsSearchResult;
  private _interactionsSearch: InteractionsSearchResult;

  // Interactors selected checkboxes list from the results-list
  private _interactorsSelected: string[];

  // private _termsSearch: any;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private router: Router,
              private interactorsSearchService: InteractorsSearchService,
              private interactionsSearchService: InteractionsSearchService) { }

  ngOnInit() {
    this.titleService.setTitle('Intact - Search Results');

    this.route.queryParams
      .filter(params => params.query)
      .subscribe(params => {
        this.term = params.query;
        this.interactorTypeFilter = params.interactorType ? params.interactorType.split('+') : [];
        this.speciesNameFilter = params.species ? params.species.split('+') : [];

        this.interactionSpeciesFilter = params.interactionSpecies ? params.interactionSpecies.split('+') : [];
        this.interactionTypeFilter = params.interactionType ? params.interactionType.split('+') : [];
        this.detectionMethodFilter = params.detectionMethod ? params.detectionMethod.split('+') : [];
        this.organismFilter = params.organism ? params.organism.split('+') : [];
        this.negativeFilter = params.negativeInteraction ? params.negativeInteraction : false;
        this.miScoreMax = params.miScoreMax ? params.miScoreMax : '';
        this.miScoreMin = params.miScoreMin ? params.miScoreMin : '';
        this.interactorsSelected = params.interactorsSelected ? params.interactorsSelected.split('+') : [];
        this.currentPageIndex = params.page ? Number(params.page) : 1;

        this.requestInteractorsResults();
        this.requestInteractionsResults();
    });
  }

  private requestInteractorsResults() {
    this.interactorsSearchService.getAllInteractorsAndFacetsQuery(
      this.term,
      this.speciesNameFilter,
      this.interactorTypeFilter,
      0,
      20
    ).subscribe(interactorsSearch => {
      this.interactorsSearch = interactorsSearch;
    })
  }

  private requestInteractionsResults() {
    this.interactionsSearchService.getAllInteractionsAndFacetsQuery(
      this.term,
      this.interactionSpeciesFilter,
      this.interactionTypeFilter,
      this.detectionMethodFilter,
      this.organismFilter,
      this.miScoreMin,
      this.miScoreMax,
      this.negativeFilter,
      this.currentPageIndex
    ).subscribe(interactionsSearch => {
      this.interactionsSearch = interactionsSearch;
      if (this.interactionsSearch.totalElements !== 0 ) {
        this.interactionsSearchService.totalElements = this.interactionsSearch.totalElements;
      }
    })
  }

  /** EVENT EMITTERS **/

  public onSpeciesNameFilterChanged(filter: string[]): void {
    this.speciesNameFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
    $(document).trigger('enhance.tablesaw');
    console.log('ENHANCING TABLE **************');
  }

  public onInteractorTypeFilterChanged(filter: string[]): void {
    this.interactorTypeFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onInteractionTypeFilterChanged(filter: string[]): void {
    this.interactionTypeFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onDetectionMethodFilterChanged(filter: string[]): void {
    this.detectionMethodFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onInteractionSpeciesFilterChanged(filter: string[]): void {
    this.interactionSpeciesFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onInteractionOrganismFilterChanged(filter: string[]): void {
    this.organismFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onInteractionNegativeFilterChanged(filter: boolean): void {
    this.negativeFilter = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  // public onInteractionmiScoreFilterChanged(filter: string[]): void {
  //   // this.miScoreFilter = filter;
  //   this.interactorsSelected = [];
  //   this.updateURLParams();
  // }

  public onInteractionMiScoreMinFilterChanged(filter: any): void {
    this.miScoreMin = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onInteractionMiScoreMaxFilterChanged(filter: any): void {
    this.miScoreMax = filter;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onResetAllFilters(): void {
    this.interactionTypeFilter = [];
    this.speciesNameFilter = [];
    this.interactionTypeFilter = [];
    this.detectionMethodFilter = [];
    this.interactionSpeciesFilter = [];
    this.organismFilter = [];
    this.negativeFilter = false;
    // this.miScoreMin = 0;
    // this.miScoreMax = 1;
    this.interactorsSelected = [];
    this.updateURLParams();
  }

  public onInteractorsSelectedChanged(interactors: string[]): void {
      this.interactorsSelected = interactors;
      this.updateURLParams();
  }

  public onPageChanged(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
    this.interactionsSearchService.page = pageIndex;
    this.updateURLParams();
  }

  public refreshResultsTable(): void {
    console.log('--------------------------------------------');
    console.log('I AM CALLED TO REFRESH THE TABLE');
    console.log('--------------------------------------------');

    $(document).trigger('enhance.tablesaw');
  }

  /** END OF EVENT EMITTERS **/


  private updateURLParams(): void {
    const params: NavigationExtras = {};
    params['query'] = this.term;
    params['page'] = this.currentPageIndex;

    if (this.interactorTypeFilter !== undefined && this.interactorTypeFilter.length !== 0) {
      params['interactorType'] = this.prepareFiltersForParams(this.interactorTypeFilter);
    }
    if (this.speciesNameFilter !== undefined && this.speciesNameFilter.length !== 0) {
      params['species'] = this.prepareFiltersForParams(this.speciesNameFilter);
    }
    if (this.interactionTypeFilter !== undefined && this.interactionTypeFilter.length !== 0) {
      params['interactionType'] = this.prepareFiltersForParams(this.interactionTypeFilter);
    }
    if (this.detectionMethodFilter !== undefined && this.detectionMethodFilter.length !== 0) {
      params['detectionMethod'] = this.prepareFiltersForParams(this.detectionMethodFilter);
    }
    if (this.interactionSpeciesFilter !== undefined && this.interactionSpeciesFilter.length !== 0) {
      params['interactionSpecies'] = this.prepareFiltersForParams(this.interactionSpeciesFilter);
    }
    if (this.organismFilter !== undefined && this.organismFilter.length !== 0) {
      params['organism'] = this.prepareFiltersForParams(this.organismFilter);
    }
    if (this.negativeFilter !== undefined && this.negativeFilter !== false) {
      params['negativeInteraction'] = this.negativeFilter;
    }
    if (this.miScoreMin !== undefined && this.miScoreMin !== '') {
      params['miScoreMin'] = this.miScoreMin;
    }
    if (this.miScoreMax !== undefined && this.miScoreMax !== '') {
      params['miScoreMax'] = this.miScoreMax;
    }

    this.router.navigate([], { queryParams: params });
  }

  private prepareFiltersForParams(filter: string[]): string {
    return filter.toString().replace(/,/g, '+');
  }


  /** GETTERS AND SETTERS **/

  get term(): string {
    return this._term;
  }

  set term(value: string) {
    this._term = value;
  }

  get speciesNameFilter(): string[] {
    return this._speciesNameFilter;
  }

  set speciesNameFilter(value: string[]) {
    this._speciesNameFilter = value;
  }

  get interactorTypeFilter(): string[] {
    return this._interactorTypeFilter;
  }

  set interactorTypeFilter(value: string[]) {
    this._interactorTypeFilter = value;
  }

  get interactionTypeFilter(): string[] {
    return this._interactionTypeFilter;
  }

  set interactionTypeFilter(value: string[]) {
    this._interactionTypeFilter = value;
  }

  get detectionMethodFilter(): string[] {
    return this._detectionMethodFilter;
  }

  set detectionMethodFilter(value: string[]) {
    this._detectionMethodFilter = value;
  }

  get interactionSpeciesFilter(): string[] {
    return this._interactionSpeciesFilter;
  }

  set interactionSpeciesFilter(value: string[]) {
    this._interactionSpeciesFilter = value;
  }

  get organismFilter(): string[] {
    return this._organismFilter;
  }

  set organismFilter(value: string[]) {
    this._organismFilter = value;
  }

  get negativeFilter(): boolean {
    return this._negativeFilter;
  }

  set negativeFilter(value: boolean) {
    this._negativeFilter = value;
  }

  get miScoreMin(): any {
    return this._miScoreMin;
  }

  set miScoreMin(value: any) {
    this._miScoreMin = value;
  }

  get miScoreMax(): any {
    return this._miScoreMax;
  }

  set miScoreMax(value: any) {
    this._miScoreMax = value;
  }

  get currentPageIndex(): number {
    return this._currentPageIndex;
  }

  set currentPageIndex(value: number) {
    this._currentPageIndex = value;
  }

// get miScoreFilter(): string[] {
  //     return this._miScoreFilter;
  //   }
  //
  // set miScoreFilter(value: string[]) {
  //   this._miScoreFilter = value;
  // }

  get interactorsSearch(): InteractorsSearchResult {
    return this._interactorsSearch;
  }

  set interactorsSearch(value: InteractorsSearchResult) {
    this._interactorsSearch = value;
  }

  get interactionsSearch(): InteractionsSearchResult {
    return this._interactionsSearch;
  }

  set interactionsSearch(value: InteractionsSearchResult) {
    this._interactionsSearch = value;
  }

// From interactors results list checkboxes

  get interactorsSelected(): string[] {
    return this._interactorsSelected;
  }

  @Input()
  set interactorsSelected(value: string[]) {
    this._interactorsSelected = value;
  }
}
