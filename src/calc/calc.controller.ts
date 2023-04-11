import { Body, Controller, Get, Param, Put, Query, Res } from '@nestjs/common';
import { CalcService } from './calc.service';
import { Headers } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Response } from 'express'

@Controller('calc')
export class CalcController {
    constructor(private readonly calcService: CalcService) { }

    @Put('/calculate')
    calculate(
        @Headers('Type-Operation') operation: string,
        @Query('num1') num1: string,
        @Query('num2') num2: string,
        @Res() response: Response,
    ) {
        const result = this.calcService.calculate(operation, Number(num1), Number(num2));
        if (!isNaN(result as number)) {
            this.calcService.create(result as number);
            response.status(200).json({ message: `Результат операции '${operation}' = ${result}` });
        } else {
            response.status(400).json({ message: result['message'] })
        }
    }

    @Patch('/calculate/:id')
    updateCalculation(
        @Param('id') id: string,
        @Query('num1') num1: number,
        @Query('num2') num2: number,
        @Headers('Type-Operation') operation: string,
        @Res() response: Response,
    ) {
        const result = this.calcService.updateCalc(id, operation, Number(num1), Number(num2));
        console.log('result = ', result)
        if (!isNaN(result as number)) {
            response.status(200).json({ message: `Результат операции '${operation}' = ${result}` });
        } else {
            response.status(400).end(result)
        }
    }

    @Get('all')
    getAll(@Res() response: Response) {
        const calc = this.calcService.getAll();
        response.status(200).json(calc);
    }
}


