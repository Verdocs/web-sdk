import {rest} from 'msw';

export const handlers = [
  rest.post('https://stage-api.verdocs.com/search/recent', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(150),
      ctx.json({
        searches: [
          {
            saved: false,
            name: false,
            lastSearched: '2021-10-04T16:14:11Z',
            params: {q: 'w9'},
          },
          {
            saved: false,
            name: false,
            lastSearched: '2021-10-02T08:45:52Z',
            params: {q: 'lease', type: 'template'},
          },
        ],
      }),
    );
    // check the `state` request param to determine what to return for our mocked response
    // the values of state are determined in our `characters-list-rest.stories.tsx`
    // const {state} = req.params;
    // switch (state) {
    //   case 'small-list': {
    //     // return a successful response after a 1.5sec delay to show our loading indicator
    //     return res(ctx.status(200), ctx.delay(1500), ctx.json(smallCharCountResponse));
    //   }
    //   case 'error': {
    //     // return an error response of 404: Not Found
    //     return res(ctx.status(404), ctx.delay(1500), ctx.json({errorMessage: 'Failure'}));
    //   }
    //   default: {
    //     // return a successful response after a 1.5sec delay to show our loading indicator
    //     return res(ctx.status(200), ctx.delay(1500), ctx.json(largeCharCountResponse));
    //   }
    // }
  }),

  rest.post('https://stage-api.verdocs.com/search/saved', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(150),
      ctx.json({
        searches: [
          {
            saved: true,
            name: 'Waiting for Signature',
            lastSearched: '2021-10-04T16:14:11Z',
            params: {type: 'document', status: ['pending', 'in-progress']},
          },
          {
            saved: true,
            name: 'Recently Completed',
            lastSearched: '2021-10-03T16:14:11Z',
            params: {type: 'document', status: ['completed']},
          },
        ],
      }),
    );
  }),
];
