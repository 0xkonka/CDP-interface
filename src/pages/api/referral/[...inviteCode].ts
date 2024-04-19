import { NextApiRequest, NextApiResponse } from 'next/types'
import { ResponseFuncs } from '@/lib/types'
import dbConnect from '@/lib/mongodb'
import { Referral } from '@/lib/models/Referral'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    //capture request method, we type it as a key of ResponseFunc to reduce typing later
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

    //function for catch errors
    const catcher = (error: Error) => res.status(400).json({ error })

    // Potential Responses
    const handleCase: ResponseFuncs = {
        // RESPONSE FOR GET REQUESTS
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            await dbConnect() // connect to database
            const { inviteCode } = req.query
            console.log('inviteCode', inviteCode?.[0])
            const result = await Referral.findOne({ inviteCode: inviteCode?.[0] }).catch(catcher)
            res.json(result)
        },
        // RESPONSE POST REQUESTS
        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            console.log('req.body', req.body)
            const { inviteCode, redeemer, signMsg } = req.body
            await dbConnect() // connect to database
            res.json(await Referral.updateOne({ inviteCode }, { $set: { redeemer, signMsg, redeemed: true } }).catch(catcher))
        }
    }

    // Check if there is a response for the particular method, if so invoke it, if not response with an error
    const response = handleCase[method]
    if (response) response(req, res)
    else res.status(400).json({ error: 'No Response for This Request' })
}

export default handler
