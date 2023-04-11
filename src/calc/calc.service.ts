import { Injectable } from '@nestjs/common';

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

@Injectable()
export class CalcService {

    private readonly calculations = {};

    calculate(operation: string, num1: number, num2: number): number | Error {
        let result: number;
        console.log(operation, typeof (operation))
        console.log(num1, typeof (num1))
        switch (operation) {
            case 'plus':
                result = num1 + num2;
                break;
            case 'minus':
                result = num1 - num2;
                break;
            case 'multiply':
                result = num1 * num2;
                break;
            default:
                return new Error('Invalid operation');
        }
        console.log(`result ${operation}=`, result, typeof (result))
        return result;
    }


    updateCalc(id: string, operation: string, num1: number, num2: number): number | Error {
        if (!this.calculations[id]) {
            return new Error(`Calc with id ${id} not found`);
        }

        let result: number;
        switch (operation) {
            case 'plus':
                result = num1 + num2;
                break;
            case 'minus':
                result = num1 - num2;
                break;
            case 'multiply':
                result = num1 * num2;
                break;
            default:
                return new Error('Invalid operation');
        }

        this.calculations[id] = result;
        return result;
    }

    create(result: number) {
        const id = getRandomInt(0, 99999)
        this.calculations[id] = result;
    }

    getAll(): Object {
        return this.calculations
    }
}
