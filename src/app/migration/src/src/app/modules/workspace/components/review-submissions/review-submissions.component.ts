import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workspaceclass } from '../../classes/workspaceclass';
import { SearchService, UserService } from '@sunbird/core';
import { ServerResponse, PaginationService } from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash';

/**
 * The Review submission  component
*/

@Component({
  selector: 'app-review-submissions',
  templateUrl: './review-submissions.component.html',
  styleUrls: ['./review-submissions.component.css']
})
export class ReviewSubmissionsComponent extends Workspaceclass implements OnInit {
  /**
    * To navigate to other pages
    */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;

  /**
   * Contains unique contentIds id
  */
  contentIds: string;
  /**
   * Contains list of published course(s) of logged-in user
  */
  reviewContent: Array<any> = [];

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
    * For showing pagination on draft list
  */
  private paginationService: PaginationService;

  /**
    * Refrence of UserService
  */
  private userService: UserService;

  /**
     * Contains page limit of inbox list
  */
  pageLimit = 9;

  /**
    * Current page number of inbox list
  */
  pageNumber = 1;

  /**
  * Contains returned object of the pagination service
  * which is needed to show the pagination on inbox view
  */
  pager: IPagination;


  /**
   * Constructor to create injected service(s) object
   Default method of Review submission  Component class
   * @param {SearchService} SearchService Reference of SearchService
   * @param {Router} route Reference of Router
   * @param {UserService} UserService Reference of UserService
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
 */
  constructor(public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService) {
    super(searchService, workSpaceService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pageNumber = Number(params.pageNumber);
      this.fetchReviewContents();
    });
  }
  /**
   * This method sets the make an api call to get all reviewContent with page No and offset
  */
  fetchReviewContents() {
    const searchParams = {
      status: ['Review'],
      contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
      objectType: 'Content',
      pageNumber: this.pageNumber,
      limit: this.pageLimit,
      userId: this.userService._userid,
      params: { lastUpdatedOn: 'desc' }
    };
    this.search(searchParams).subscribe(
      (data: ServerResponse) => {
        if (data.result.count && data.result.content) {
          this.reviewContent = data.result.content;
          this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
          this.showLoader = false;
        }
      },
      (err: ServerResponse) => {
        this.showLoader = false;
      }
    );
  }

  actionClick(event) {
  }

  /**
 * This method helps to navigate to different pages.
 * If page number is less than 1 or page number is greater than total number
 * of pages is less which is not possible, then it returns.
 *
 * @param {number} page Variable to know which page has been clicked
 *
 * @example navigateToPage(1)
 */
  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.route.navigate(['workspace/content/review', this.pageNumber]);
  }
}
