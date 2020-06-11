module.exports = {
  name: 'todo-data-access-todo-api-client',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/libs/todo/data-access/todo-api-client',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
