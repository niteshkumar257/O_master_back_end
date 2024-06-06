import { client } from "../db/config.js";
export const rollDice = async (req, res) => {
  const { amount, type } = req.body;

  console.log( type);
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const sum = dice1 + dice2;

  let outcome = "lose";
  if (
    (type === "7up" && sum > 7) ||
    (type === "7down" && sum < 7) ||
    (type === "7" && sum === 7)
  ) {
    outcome = "win";
  }
 
  res.json({ dice1, dice2, outcome });
};

export const updatePoints = async (req, res) => {
  const { user_id } = req.params;
  let { amount, result,type } = req.body;
  if (result !== "win") 
    {
      amount = -1 * amount;
    }else
    {
       if(type==='7') amount=amount*5;
       else amount=amount*2;
    }

  if (!user_id) {
  return  res.status(404).json({
      status: "fail",
      message: "user id is required",
    });
    
  }
  if (!amount) {
  return  res.status(404).json({
      status: "fail",
      message: "bet amount is required",
    });
  }
  if (!result) {
   return res.status(404).json({
      status: "fail",
      message: "outcome is required",
    });
  }
  try {
    const user = await client.query(
      `select * from user_info where user_id=$1`,
      [user_id]
    );
    let { total_points } = user.rows[0];
    total_points = total_points + amount;

    await client.query(
      "UPDATE user_info SET total_points = $1 WHERE user_id = $2",
      [total_points, user_id]
    );
    await client.query(`INSERT into bets (user_id,bet_type,amount,result) values($1,$2,$3,$4)`,[user_id,type,amount,result])
    res.status(200).json({ message: "Points updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
export const getPoints = async (req, res) => {
  const { user_id } = req.params;
  try {
    const points = await client.query(
      `select * from user_info where user_id=$1`,
      [user_id]
    );
   
    let {total_points}=points.rows[0];
    res.status(200).json({
      points: total_points,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "server error",
    });
  }
};
export const getAllGames=async(req,res)=>{
  const {user_id}=req.params;
  try{
    const all_games=await client.query(`select *from bets where user_id=$1`,[user_id])
    res.status(200).json({
      status:'success',
      all_games:all_games.rows
    })

  }catch(err)
  {
    res.status(500).json({
      status: "fail",
      message: "server error",
    });
  }

}
