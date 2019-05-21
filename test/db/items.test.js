const { expect } = require('chai');
const sinon = require('sinon');

// local imports
const logger = require('../../config/logger');
const pool = require('../../db/index');
const { getItemData } = require('../../db/items');

describe('Test Item Queries', () => {
  before(() => {
    // disable logging
    logger.silent = true;
  });

  afterEach(() => {
    pool.query.restore();
  });

  describe('getItemData', () => {
    it('Should resolve items data ', () => {
      const obj = {
        'rows': [
          {
            'id': 175,
            'iso31661alpha2': 'PT',
            'iso31661alpha3': 'PRT',
            'name': 'Portugal',
            'continent': 'EU',
            'dial': '351',
            'iso31661numeric': 620,
            'validfrom': null,
            'validto': null,
          },
        ],
      };
      sinon.stub(pool, 'query').resolves(obj);

      return getItemData('readonly', 'country', 175)
        .then((result) => {
          expect(result).to.be.an('object');
          expect(result).to.include.all.keys(
            'id',
            'iso31661alpha2',
            'iso31661alpha3',
            'name',
            'continent',
            'iso31661numeric',
            'validfrom',
            'validto',
          );
        });
    });

    it('Should reject with an error if the role, table or id, do not exist', () => {
      const expectedMsg = 'Unable to retrieve data from table country row id 175';
      sinon.stub(pool, 'query').rejects();

      return getItemData('readonly', 'country', 175)
        .catch(error => expect(error.message).to.eql(expectedMsg));
    });
  });
});