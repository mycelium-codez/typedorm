import {Condition} from '../condition';
import {ExpressionBuilder} from '../expression-builder';
import {Filter} from '../filter';
import {Projection} from '../projection';

const expressionBuilder = new ExpressionBuilder();

/**
 * @group buildConditionExpression
 */
test('builds condition expression', () => {
  const conditionExpression = expressionBuilder.buildConditionExpression(
    new Condition().attributeNotExist('PK')
  );

  expect(conditionExpression).toEqual({
    ConditionExpression: 'attribute_not_exists(#CE_PK)',
    ExpressionAttributeNames: {
      '#CE_PK': 'PK',
    },
  });
});

test('builds condition expression', () => {
  const conditionExpression = expressionBuilder.buildConditionExpression(
    new Condition().attributeNotExist('PK')
  );

  expect(conditionExpression).toEqual({
    ConditionExpression: 'attribute_not_exists(#CE_PK)',
    ExpressionAttributeNames: {
      '#CE_PK': 'PK',
    },
  });
});

/**
 * @group buildUpdateExpression
 */
test('builds update expression', () => {
  const item = {
    name: 'new name',
  };
  const expression = expressionBuilder.buildUpdateExpression(item);
  expect(expression).toEqual({
    UpdateExpression: 'SET #attr0 = :val0',
    ExpressionAttributeNames: {
      '#attr0': 'name',
    },
    ExpressionAttributeValues: {
      ':val0': 'new name',
    },
  });
});

test('builds update expression for nested object', () => {
  const item = {
    'user.name': 'new name',
  };
  const expression = expressionBuilder.buildUpdateExpression(item);
  expect(expression).toEqual({
    UpdateExpression: 'SET #attr0_inner0.#attr0_inner1 = :val0',
    ExpressionAttributeNames: {
      '#attr0_inner0': 'user',
      '#attr0_inner1': 'name',
    },
    ExpressionAttributeValues: {
      ':val0': 'new name',
    },
  });
});

test('builds update expression for complex nested object', () => {
  const item = {
    application: 'test',
    'profile.name.last': 'new Last name',
    data: [1, 2, 3],
    'address[0]': 'new address portion',
    'complex.nested.object[1]': 'new value',
  };
  const expression = expressionBuilder.buildUpdateExpression(item);
  expect(expression).toEqual({
    UpdateExpression:
      'SET #attr0 = :val0, #attr1_inner0.#attr1_inner1.#attr1_inner2 = :val1, #attr2 = :val2, #attr3 = :val3, #attr4_inner0.#attr4_inner1.#attr4_inner2 = :val4',
    ExpressionAttributeNames: {
      '#attr0': 'application',
      '#attr1_inner0': 'profile',
      '#attr1_inner1': 'name',
      '#attr1_inner2': 'last',
      '#attr2': 'data',
      '#attr3': 'address[0]',
      '#attr4_inner0': 'complex',
      '#attr4_inner1': 'nested',
      '#attr4_inner2': 'object[1]',
    },
    ExpressionAttributeValues: {
      ':val0': 'test',
      ':val1': 'new Last name',
      ':val2': [1, 2, 3],
      ':val3': 'new address portion',
      ':val4': 'new value',
    },
  });
});

/**
 * Issue 41
 */
test('allows updating attribute with undefined value', () => {
  const item = {
    'user.name': undefined,
  };
  const expression = expressionBuilder.buildUpdateExpression(item);
  expect(expression).toEqual({
    UpdateExpression: 'SET #attr0_inner0.#attr0_inner1 = :val0',
    ExpressionAttributeNames: {
      '#attr0_inner0': 'user',
      '#attr0_inner1': 'name',
    },
    ExpressionAttributeValues: {
      ':val0': null,
    },
  });
});

/**
 * Issue 41
 */
test('allows updating attribute with empty string', () => {
  const item = {
    'user.name': '',
  };
  const expression = expressionBuilder.buildUpdateExpression(item);
  expect(expression).toEqual({
    UpdateExpression: 'SET #attr0_inner0.#attr0_inner1 = :val0',
    ExpressionAttributeNames: {
      '#attr0_inner0': 'user',
      '#attr0_inner1': 'name',
    },
    ExpressionAttributeValues: {
      ':val0': '',
    },
  });
});

/**
 * @group buildFilterExpression
 */
test('builds filter expression', () => {
  const filter = new Filter().attributeNotExists('profile.deleted');
  const filterExpression = expressionBuilder.buildFilterExpression(filter);

  expect(filterExpression).toEqual({
    ExpressionAttributeNames: {
      '#FE_profile': 'profile',
      '#FE_profile_deleted': 'deleted',
    },
    FilterExpression: 'attribute_not_exists(#FE_profile.#FE_profile_deleted)',
  });
});

/**
 * @group buildProjectionExpression
 */
test('builds projection expression', () => {
  const projection = new Projection().addProjectionAttributes([
    'name',
    'user.status',
  ]);

  const projectionExpression = expressionBuilder.buildProjectionExpression(
    projection
  );

  expect(projectionExpression).toEqual({
    ExpressionAttributeNames: {
      '#PE_name': 'name',
      '#PE_user': 'user',
      '#PE_user_status': 'status',
    },
    ProjectionExpression: '#PE_name, #PE_user.#PE_user_status',
  });
});
