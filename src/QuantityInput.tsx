import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

function QuantityInput({ value, onChange, min = 1, max }: QuantityInputProps) {
  //haelt den wert immer zwischen min und max
  const clamp = (next: number) => {
    if (Number.isNaN(next)) return min;
    if (next < min) return min;
    if (max !== undefined && next > max) return max;
    return next;
  };

  return (
    <div className='flex items-center gap-1'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Weniger'
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus />
      </Button>

      <Input
        type='number'
        className='w-16 text-center'
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
      />

      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Mehr'
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus />
      </Button>
    </div>
  );
}

export default QuantityInput;
