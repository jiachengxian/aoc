pub mod intcode {
    struct IntCode{
        data : Vec<i64>,
        ins_ptr : usize,
        rel_base: i64,
        input : i64,
        output : i64
    }

    impl IntCode {
        #[inline]
        pub fn new(data : Vec<i64>, ins_ptr : usize, rel_base: i64, input: i64) -> Self {
            IntCode{
                data : data.to_vec(),
                ins_ptr : ins_ptr,
                rel_base : rel_base,
                input : input,
                output : 0
            }
        }
        #[inline]
        pub fn run(&mut self) -> (i64, usize, i64, Vec<i64>, bool) {
            while self.ins_ptr < self.data.len(){
                let instruction_code = self.data[self.ins_ptr];
                let opcode = instruction_code % 100;
                match opcode{
                    1 | 2 => {
                        let insert_index = self.get_insert_index(3);
                        let params = self.get_params(2);
                        if opcode == 1 {
                            self.set_instruction(insert_index, params[0] + params[1]);
                        }
                        else{
                            self.set_instruction(insert_index, params[0] * params[1]);
                        }
                        self.ins_ptr+=4;
                    },
                    3 => {
                        let insert_index = self.get_insert_index(1);
                        self.set_instruction(insert_index, self.input);
                        self.ins_ptr+=2;
                    },
                    4 => {
                        let params = self.get_params(1);
                        self.ins_ptr+=2;
                        self.output = params[0];
                        break;
                    },
                    5 | 6 => {
                        let params = self.get_params(2);
                        if (opcode == 5 && params[0] == 0) || (opcode == 6 && params[0] != 0) {
                            self.ins_ptr+=3;
                            continue;
                        }
                        self.ins_ptr = params[1] as usize;
                    },
                    7 | 8 => {
                        let params = self.get_params(2);
                        let insert_index = self.get_insert_index(3);
                        if (opcode == 7 && params[0] < params[1]) || (opcode == 8 && params[0] == params[1]) {
                            self.set_instruction(insert_index, 1);
                        }else{
                            self.set_instruction(insert_index, 0);
                        }
                        self.ins_ptr+=4;
                    },
                    9 => {
                        let params = self.get_params(1);
                        self.rel_base += params[0];
                        self.ins_ptr+=2;
                    },
                    99 => {
                        return (self.output, self.ins_ptr, self.rel_base, self.data.to_vec(), true);
                    },
                    _ => break,
                }
            }
            (self.output, self.ins_ptr, self.rel_base, self.data.to_vec(), false)
        }
        #[inline]
        pub fn get_params(&mut self, num_params: usize) -> Vec<i64> {
            let mut params = Vec::new();
            for i in 1..num_params+1{
                let param_mode = self.data[self.ins_ptr] / 10_i64.pow(i as u32+1) % 10;
                let value = self.get_instruction(self.ins_ptr+i);
                params.push(self.handle_parameter_mode(param_mode, value));
            }
            params
        }
        #[inline]
        pub fn get_insert_index(&mut self, param_index: usize) -> usize {
            let param_mode = self.data[self.ins_ptr] / 10_i64.pow(param_index as u32+1) % 10;
            match param_mode{
                0 => return self.get_instruction(self.ins_ptr + param_index) as usize,
                2 => return (self.get_instruction(self.ins_ptr + param_index) + self.rel_base) as usize,
                _ => panic!("Unexpected insert self.ins_ptr param mode parsed : {}", param_mode)
            }
        }
        #[inline]
        pub fn handle_parameter_mode(&mut self, param_mode : i64, value: i64) -> i64{
            match param_mode{
                0 => return self.get_instruction(value as usize),
                1 => return value,
                2 => return self.get_instruction((value + self.rel_base) as usize),
                _ => panic!("Unexpected param mode parsed : {}", param_mode)
            }
        }
        #[inline]
        pub fn handle_overflow(&mut self, index: usize) {
            if index < self.data.len() {
                return;
            }
            self.data.extend(vec![0;index-self.data.len()+1]);
        }
        #[inline]
        pub fn get_instruction(&mut self, index: usize) -> i64 {
            self.handle_overflow(index);
            self.data[index]
        }
        #[inline]
        pub fn set_instruction(&mut self, index : usize, value : i64) {
            self.handle_overflow(index);
            self.data[index] = value;
        }
    }
}