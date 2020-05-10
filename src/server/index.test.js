import { apiKeysavailable } from "./index";

window.alert = jest.fn();

test('API key check', () => {
    const result1 = apiKeysavailable("");
    expect(result1).toBe(false);
    const result2 = apiKeysavailable("652fd4325adbc2");
    expect(result2).toBe(true);
});