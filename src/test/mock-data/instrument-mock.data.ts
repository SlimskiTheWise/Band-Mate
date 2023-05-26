import { Condition } from 'src/instruments/enums/condition.enum';
import { Type } from 'src/instruments/enums/type.enum';
import { Instruments } from 'src/instruments/instruments.entity';

export function seedSingleInstrument(index = 1): Instruments {
  const instrument = new Instruments();
  instrument.id = index;
  instrument.condition = Condition.GOOD;
  instrument.location = 'seoul';
  instrument.price = 10000;
  instrument.title = 'gibson guitar';
  instrument.description = 'gibson guitar in good condition';
  instrument.type = Type.GUITAR;
  instrument.createdAt = new Date();
  instrument.updatedAt = new Date();
  instrument.deletedAt = null;
  return instrument;
}

export function seedManyInstruments(): Instruments[] {
  return Array.from({ length: 50 }, (_, i) => seedSingleInstrument(i));
}
