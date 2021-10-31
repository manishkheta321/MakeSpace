const assert = require("assert");

const converter = require("../convertTime");
describe("convertTime.js tests", () => {
  it("should return 65", () => {
    const result = converter.convertTimeToMinutes("01:05");
    assert.equal(result, 65);
  });
  it("should return 120", () => {
    const result = converter.convertTimeToMinutes("02:00");
    assert.equal(result, 120);
  });
});
