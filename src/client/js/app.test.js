import { testNameCity } from "./app";

window.alert = jest.fn();

test('Input for city name form', () => {
    const result1 = testNameCity("");
    expect(result1).toBe(false);
    const result2 = testNameCity("London5");
    expect(result2).toBe(false);
    const result3 = testNameCity("Los-Angeles");
    expect(result3).toBe(false);
    const result4 = testNameCity("Los Angeles");
    expect(result4).toBe(true);
});