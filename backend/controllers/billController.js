const billQueries = require('../db/billQueries');

class BillController {

    // Get all bills (with summary)
    async getAll(req, res) {

        try {

            const bills =
                await billQueries.getAllBills();

            res.json(bills);

        } catch (error) {

            console.error(
                'Error fetching bills:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to fetch bills'
            });
        }
    }

    async updateBillStatus(req, res) {
        try {
            const { id } = req.params; 
            
            // sqlConnection එක මේ ෆයිල් එකේ උඩින්ම require කරලා නැත්නම් විතරක් මේ පේළිය වැඩ කරාවි
            const { getConnection } = require('../db/sqlConnection'); 
            const connection = await getConnection();
            
            await connection.request()
                .input('id', id)
                .query(`UPDATE bills SET status = 'Paid' WHERE bill_id = @id`);

            res.json({ message: 'Payment successful!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update payment status' });
        }
    }

    // Get bill details by bill ID
    async getById(req, res) {

        try {

            const { id } =
                req.params;

            const billDetails =
                await billQueries
                    .getBillDetails(id);

            if (
                billDetails.length === 0
            ) {

                return res.status(404)
                    .json({

                        error:
                            'Bill not found'
                    });
            }

            // Group details
            const bill = {

                bill_id:
                    billDetails[0].bill_id,

                prescription_id:
                    billDetails[0].prescription_id,

                patient_id:
                    billDetails[0].patient_id,

                patient_name:
                    billDetails[0].patient_name,

                patient_phone:
                    billDetails[0].phone,

                patient_age:
                    billDetails[0].age,

                doctor_id:
                    billDetails[0].doctor_id,

                doctor_name:
                    billDetails[0].doctor_name,

                doctor_specialization:
                    billDetails[0].specialization,

                bill_date:
                    billDetails[0].bill_date,

                status:
                    billDetails[0].status,

                items:

                    billDetails

                        .filter(
                            row =>
                                row.item_id
                        )

                        .map(row => ({

                            item_id:
                                row.item_id,

                            medicine_id:
                                row.medicine_id,

                            medicine_name:
                                row.medicine_name,

                            quantity:
                                row.quantity,

                            unit_price:
                                row.unit_price,

                            item_total:
                                row.item_total
                        })),

                total_items:

                    billDetails

                        .filter(
                            row =>
                                row.item_id
                        )

                        .length,

                total_amount:
                    billDetails[0].total_amount
            };

            res.json(bill);

        } catch (error) {

            console.error(
                'Error fetching bill details:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to fetch bill details'
            });
        }
    }

    // Get bills by patient
    async getByPatient(req, res) {

        try {

            const { patientId } =
                req.params;

            const bills =
                await billQueries
                    .getBillsByPatient(
                        patientId
                    );

            res.json(bills);

        } catch (error) {

            console.error(
                'Error fetching patient bills:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to fetch patient bills'
            });
        }
    }

    // Get bills by doctor
    async getByDoctor(req, res) {

        try {

            const { doctorId } =
                req.params;

            const bills =
                await billQueries
                    .getBillsByDoctor(
                        doctorId
                    );

            res.json(bills);

        } catch (error) {

            console.error(
                'Error fetching doctor bills:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to fetch doctor bills'
            });
        }
    }

    // Get monthly bill report
    async getMonthlyReport(req, res) {

        try {

            const report =
                await billQueries
                    .getMonthlyBillReport();

            res.json(report);

        } catch (error) {

            console.error(
                'Error fetching monthly report:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to fetch monthly report'
            });
        }
    }

    // Calculate bill amount
    async calculateAmount(req, res) {

        try {

            const { id } =
                req.params;

            const billAmount =
                await billQueries
                    .calculateBillAmount(id);

            if (
                billAmount.length === 0
            ) {

                return res.status(404)
                    .json({

                        error:
                            'Bill not found'
                    });
            }

            res.json(
                billAmount[0]
            );

        } catch (error) {

            console.error(
                'Error calculating bill amount:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to calculate bill amount'
            });
        }
    }

    // Generate full bill document
    async generateBill(req, res) {

        try {

            const { id } =
                req.params;

            const billData =
                await billQueries
                    .getBillDetails(id);

            if (
                billData.length === 0
            ) {

                return res.status(404)
                    .json({

                        error:
                            'Bill not found'
                    });
            }

            const bill = {

                bill_id:
                    billData[0].bill_id,

                prescription_id:
                    billData[0].prescription_id,

                patient_id:
                    billData[0].patient_id,

                patient_name:
                    billData[0].patient_name,

                patient_age:
                    billData[0].age,

                patient_phone:
                    billData[0].phone,

                doctor_id:
                    billData[0].doctor_id,

                doctor_name:
                    billData[0].doctor_name,

                doctor_specialization:
                    billData[0].specialization,

                bill_date:
                    billData[0].bill_date,

                status:
                    billData[0].status,

                items:

                    billData

                        .filter(
                            row =>
                                row.item_id
                        )

                        .map(row => ({

                            medicine_id:
                                row.medicine_id,

                            medicine_name:
                                row.medicine_name,

                            quantity:
                                row.quantity,

                            unit_price:
                                row.unit_price,

                            total:
                                row.item_total
                        })),

                summary: {

                    total_items:

                        billData

                            .filter(
                                row =>
                                    row.item_id
                            )

                            .length,

                    total_quantity:

                        billData

                            .filter(
                                row =>
                                    row.item_id
                            )

                            .reduce(

                                (sum, row) =>

                                    sum +
                                    row.quantity,

                                0
                            ),

                    total_amount:
                        billData[0]
                            .total_amount
                }
            };

            res.json(bill);

        } catch (error) {

            console.error(
                'Error generating bill:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to generate bill'
            });
        }
    }

    // Update bill status
    async updateStatus(req, res) {

        try {

            const { id } =
                req.params;

            const { status } =
                req.body;

            if (
                ![
                    'pending',
                    'paid',
                    'cancelled'
                ].includes(status)
            ) {

                return res.status(400)
                    .json({

                        error:
                            'Invalid status. Must be pending, paid, or cancelled'
                    });
            }

            const result =
                await billQueries
                    .updateBillStatus(
                        id,
                        status
                    );

            if (
                result[0] === 0
            ) {

                return res.status(404)
                    .json({

                        error:
                            'Bill not found'
                    });
            }

            res.json({

                message:
                    'Bill status updated successfully',

                bill_id:
                    id,

                status
            });

        } catch (error) {

            console.error(
                'Error updating bill status:',
                error
            );

            res.status(500).json({

                error:
                    'Failed to update bill status'
            });
        }
    }
    // MAKE PAYMENT
async makePayment(req, res) {

    try {

        const { id } = req.params;

        const {
            amount,
            payment_method
        } = req.body;

        //--------------------------------------------------
        // VALIDATION
        //--------------------------------------------------

        if (!amount || Number(amount) <= 0) {

            return res.status(400).json({

                error: 'Valid payment amount required'

            });
        }

        //--------------------------------------------------
        // PROCESS PAYMENT
        //--------------------------------------------------

        const result =
            await billQueries.makePayment(

                id,

                amount,

                payment_method || 'Cash'

            );

        //--------------------------------------------------
        // SUCCESS RESPONSE
        //--------------------------------------------------

        res.json({

            message: 'Payment successful',

            payment: result

        });

    } catch (error) {

        console.error(
            'Payment Error:',
            error.message
        );

        res.status(500).json({

            error: error.message

        });
    }
}
}

module.exports =
    new BillController();