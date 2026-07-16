import checkoutTimeout from "@/modules/bug-hunting/data/scenarios/checkout-timeout.json";


const scenarios = [
  checkoutTimeout,
];


export class ScenarioRegistry {

  static getAll() {
    return scenarios;
  }


  static get(id: string) {

    return scenarios.find(
      scenario =>
        scenario.id === id,
    );
  }
}